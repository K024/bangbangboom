using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

// ------------------ out of date ----------------------
namespace bangbangboom.GameCore
{
    public abstract class Note : IComparable<Note>
    {
        public int CompareTo(Note other)
        {
            return Extensions.Compare(this, other,
                a => a.GetTime(),
                a => a.GetLane());
        }
    }

    public class Single : Note
    {
        /// <summary>左边第一条是0</summary>
        public int lane;
        /// <summary>从计时点开始 1/24 个4分音符数量</summary>
        public int time;
    }

    public class Flick : Note
    {
        public int lane;
        public int time;
    }

    public class Slide : Note
    {
        public List<Single> notes;
        public bool flickEnd;
    }

    public class TimePoint : IComparable<TimePoint>
    {
        /// <summary>计时起始点，以秒计</summary>
        public double time;
        /// <summary>每分钟节拍数</summary>
        public double bpm;
        /// <summary>每小节拍数 beats per bar</summary>
        public int bpb;
        public List<Note> notes;

        public int CompareTo(TimePoint b)
        {
            return Extensions.Compare(this, b,
                a => a.time,
                a => a.notes.Count,
                a => a.bpm,
                a => a.bpb);
        }
    }
    public class MapContent
    {
        public List<TimePoint> timePoints;
    }

    static class Extensions
    {
        public static int GetTime(this Note note)
        {
            if (note is Single single) return single.time;
            else if (note is Flick flick) return flick.time;
            else if (note is Slide longn) return longn.notes[0]?.time ?? 0;
            throw new ArgumentException();
        }

        public static int GetLane(this Note note)
        {
            if (note is Single single) return single.lane;
            else if (note is Flick flick) return flick.lane;
            else if (note is Slide longn) return longn.notes[0]?.lane ?? 0;
            throw new ArgumentException();
        }
        public static int Compare<T>(T left, T right, params Func<T, IComparable>[] props)
        {
            int result = 0;
            foreach (var prop in props)
            {
                result = prop(left).CompareTo(prop(right));
                if (result != 0) break;
            }
            return result;
        }

        public static bool Normalize(this MapContent map)
        {
            var same = 0;
            map.timePoints.Sort();
            map.timePoints.ForEach(tp =>
            {
                var all = new List<Note>();
                tp.notes.Sort();
                foreach (var note in tp.notes)
                {
                    if (note is Slide longn)
                    {
                        longn.notes.Sort();
                        all.AddRange(longn.notes);
                    }
                    else
                    {
                        all.Add(note);
                    }
                }
                same += all.GroupBy(x => x).Where(g => g.Count() > 1).Select(n => n.Key).Count();
            });
            if (same > 0) return false;
            return true;
        }
    }
}
