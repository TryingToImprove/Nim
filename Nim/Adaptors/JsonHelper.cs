using Newtonsoft.Json;

namespace Nim.Adaptors
{
    public class JsonHelper
    {
        public static object SerializeObject<T>(T game)
        {
            return JsonConvert.DeserializeObject(
                    JsonConvert.SerializeObject(game, Formatting.Indented, new JsonSerializerSettings()
                    {
                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                    })
                );
        }
    }
}