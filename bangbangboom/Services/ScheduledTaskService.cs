using bangbangboom.Data;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace bangbangboom.Services {
    public class ScheduedTaskService : BackgroundService {
        private readonly TaskCompletionSource<int> completionSource = new TaskCompletionSource<int>();
        private Timer timer;
        private readonly IServiceProvider services;
        private readonly ILogger<ScheduedTaskService> logger;

        public ScheduedTaskService(IServiceProvider provider, ILogger<ScheduedTaskService> logger) {
            services = provider;
            this.logger = logger;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken) {
            timer = new Timer(MyTask, null, TimeSpan.FromMinutes(5), TimeSpan.FromHours(6));
            stoppingToken.Register(() => {
                timer.Dispose();
                completionSource.SetResult(0);
            });
            return completionSource.Task;
        }
        protected void MyTask(object state) {
            Task.Run(async () => {
                using var scope = services.CreateScope();
                using var context = scope.ServiceProvider.GetService<AppDbContext>();

                await Task.CompletedTask;
                logger.LogInformation("Scheduled task finished at " + DateTime.Now);
            });
        }
    }
}
