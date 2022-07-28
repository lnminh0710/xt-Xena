using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
//using XenaUI.PostSharp.ExceptionHandling;

// Add the AddContextOnException aspect to all methods in the assembly.
//[assembly: PostSharpAddContextOnException]
namespace XenaUI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();

            //var host = new WebHostBuilder()
            //    .UseKestrel()
            //    .UseContentRoot(Directory.GetCurrentDirectory())
            //    .UseIISIntegration()
            //    .UseStartup<Startup>()
            //    .Build();

            //host.Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseKestrel(options =>
                {
                    options.Limits.MaxRequestBodySize = 2097152000;
                    options.Limits.KeepAliveTimeout = System.TimeSpan.FromMinutes(20);
                })
                .UseSentry();
    }
}
