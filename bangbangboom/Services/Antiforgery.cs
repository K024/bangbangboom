using System;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc;

namespace bangbangboom {
    class ValidateAntiforgeryTokenAuthorizationFilter : IAsyncAuthorizationFilter, IAntiforgeryPolicy {
        private readonly IAntiforgery _antiforgery;
        private readonly ILogger _logger;

        public ValidateAntiforgeryTokenAuthorizationFilter(IAntiforgery antiforgery, ILoggerFactory loggerFactory) {
            _antiforgery = antiforgery ?? throw new ArgumentNullException(nameof(antiforgery));
            _logger = loggerFactory.CreateLogger(GetType());
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context) {
            if (context == null) {
                throw new ArgumentNullException(nameof(context));
            }
            if (!context.IsEffectivePolicy<IAntiforgeryPolicy>(this)) {
                _logger.NotMostEffectiveFilter(typeof(IAntiforgeryPolicy));
                return;
            }
            if (ShouldValidate(context)) {
                try {
                    await _antiforgery.ValidateRequestAsync(context.HttpContext);
                } catch (AntiforgeryValidationException exception) {
                    _logger.AntiforgeryTokenInvalid(exception.Message, exception);
                    context.Result = new AntiforgeryValidationFailedResult();
                }
            }
        }

        protected virtual bool ShouldValidate(AuthorizationFilterContext context) {
            if (context == null) {
                throw new ArgumentNullException(nameof(context));
            }
            return true;
        }
    }
    class AutoValidateAntiforgeryTokenAuthorizationFilter : ValidateAntiforgeryTokenAuthorizationFilter {
        public AutoValidateAntiforgeryTokenAuthorizationFilter(IAntiforgery antiforgery, ILoggerFactory loggerFactory)
            : base(antiforgery, loggerFactory) {
        }

        protected override bool ShouldValidate(AuthorizationFilterContext context) {
            if (context == null) {
                throw new ArgumentNullException(nameof(context));
            }
            var method = context.HttpContext.Request.Method;
            if (string.Equals("GET", method, StringComparison.OrdinalIgnoreCase) ||
                string.Equals("HEAD", method, StringComparison.OrdinalIgnoreCase) ||
                string.Equals("TRACE", method, StringComparison.OrdinalIgnoreCase) ||
                string.Equals("OPTIONS", method, StringComparison.OrdinalIgnoreCase)) {
                return false;
            }
            // Anything else requires a token.
            return true;
        }
    }
    static class MvcViewFeaturesLoggerExtensions {

        private static readonly Action<ILogger, Type, Exception> _notMostEffectiveFilter;
        private static readonly Action<ILogger, string, Exception> _antiforgeryTokenInvalid;

        static MvcViewFeaturesLoggerExtensions() {
            _notMostEffectiveFilter = LoggerMessage.Define<Type>(
                LogLevel.Trace,
                new EventId(1, "NotMostEffectiveFilter"),
                "Skipping the execution of current filter as its not the most effective filter implementing the policy {FilterPolicy}.");
            _antiforgeryTokenInvalid = LoggerMessage.Define<string>(
                LogLevel.Information,
                new EventId(1, "AntiforgeryTokenInvalid"),
                "Antiforgery token validation failed. {Message}");
        }
        public static void NotMostEffectiveFilter(this ILogger logger, Type policyType) {
            _notMostEffectiveFilter(logger, policyType, null);
        }
        public static void AntiforgeryTokenInvalid(this ILogger logger, string message, Exception exception) {
            _antiforgeryTokenInvalid(logger, message, exception);
        }
    }

    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public class AutoValidateAntiforgeryTokenAttribute : Attribute, IFilterFactory, IOrderedFilter {
        public int Order { get; set; } = 1000;

        public bool IsReusable => true;

        public IFilterMetadata CreateInstance(IServiceProvider serviceProvider) {
            return serviceProvider.GetRequiredService<AutoValidateAntiforgeryTokenAuthorizationFilter>();
        }
    }
}
