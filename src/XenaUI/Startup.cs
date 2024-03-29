using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.IO;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Http;
using XenaUI.Business;
using XenaUI.Service;
using XenaUI.Utils;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SimpleTokenProvider;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using XenaUI.Constants;
using Microsoft.Extensions.DependencyInjection.Extensions;
using AutoMapper;
using XenaUI.Models;
using Swashbuckle.AspNetCore.Swagger;

namespace XenaUI
{
    public class Startup
    {
        public IConfiguration Configuration { get; set; }
        readonly private string OAuthSecretKey;
        readonly private SymmetricSecurityKey OAuthSigningKey;
        private IHostingEnvironment CurrentEnvironment { get; set; }

        public Startup(IHostingEnvironment env)
        {
            //https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-2.1

            CurrentEnvironment = env;

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            if (env.IsEnvironment("Development"))
            {
                // This will push telemetry data through Application Insights pipeline faster, allowing you to view results immediately.
                builder.AddApplicationInsightsSettings(developerMode: true);
            }

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();

            // get OAuthSecretKey from "appsetting.json" file
            OAuthSecretKey = Configuration[ConstAuth.AppSettings_OAuthSecretKey];
            // set value for OAuthSigningKey
            OAuthSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(OAuthSecretKey));
        }

        // This method gets called by the runtime. Use this method to add services to the container
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddApplicationInsightsTelemetry(Configuration);

            #region Cors
            // REF: https://docs.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-2.1
            // Enable Crossdomain
            services.AddCors();
            #endregion

            if (CurrentEnvironment.IsDevelopment())
            {
                // Register the Swagger generator, defining 1 or more Swagger documents
                services.AddSwaggerGen(c =>
                {
                    c.SwaggerDoc("v1", new Info { Title = "XenaUI API", Version = "v1" });
                    //c.AddSecurityDefinition("Bearer", new ApiKeyScheme { In = "header", Description = "Please enter JWT with Bearer into field", Name = "Authorization", Type = "apiKey" });
                    //c.AddSecurityRequirement(new Dictionary<string, IEnumerable<string>> { { "Bearer", System.Linq.Enumerable.Empty<string>() }, });
                });
            }

            #region AutoMapper
            // Auto Mapper Configurations
            var mappingConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new AutoMapperProfile());
            });
            IMapper mapper = mappingConfig.CreateMapper();
            services.TryAddSingleton(mapper);

            //services.AddAutoMapper(x => x.AddProfile(new AutoMapperProfile()));
            #endregion

            services.AddMvc(config =>
            {
                config.Filters.Add(typeof(CustomExceptionFilter));

                // Make authentication compulsory across the board (i.e. shut
                // down EVERYTHING unless explicitly opened up).
                var policy = new AuthorizationPolicyBuilder()
                                 .RequireAuthenticatedUser()
                                 .Build();
                config.Filters.Add(new AuthorizeFilter(policy));
            });

            //Configure Jwt
            ConfigureJwt(services);

            services.AddResponseCompression();

            services.AddMemoryCache();

            #region Injection Class
            services.AddScoped<ResultActionFilter>();

            // Register the IConfiguration instance which AppSettings binds against.
            services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));
            services.Configure<SentrySettings>(Configuration.GetSection("Sentry"));

            services.AddSingleton(Configuration);
            services.TryAddSingleton<IAppServerSetting, AppServerSetting>();

            services.AddTransient<IBaseBusiness, BaseBusiness>();
            services.AddTransient<IAuthenticateBusiness, AuthenticateBusiness>();

            services.AddTransient<IUniqueBusiness, UniqueBusiness>();
            services.AddTransient<IUniqueService, UniqueService>();

            services.AddTransient<IParkedItemService, ParkedItemService>();
            services.AddTransient<IParkedItemBusiness, ParkedItemBusiness>();

            services.AddTransient<ISearchService, SearchService>();
            services.AddTransient<ISearchBusiness, SearchBusiness>();

            services.AddTransient<IGlobalService, GlobalService>();
            services.AddTransient<IGlobalBusiness, GlobalBusiness>();

            services.AddTransient<IPersonService, PersonService>();
            services.AddTransient<IPersonBusiness, PersonBusiness>();

            services.AddTransient<IArticleService, ArticleService>();
            services.AddTransient<IArticleBusiness, ArticleBusiness>();

            services.AddTransient<ICampaignService, CampaignService>();
            services.AddTransient<ICampaignBusiness, CampaignBusiness>();

            services.AddTransient<IOrderDataEntryService, OrderDataEntryService>();
            services.AddTransient<IOrderDataEntryBusiness, OrderDataEntryBusiness>();
            services.AddTransient<IOrderFailedBusiness, OrderFailedBusiness>();

            services.AddTransient<IToolsService, ToolsService>();
            services.AddTransient<IToolsBusiness, ToolsBusiness>();

            services.AddTransient<IBackOfficeService, BackOfficeService>();
            services.AddTransient<IBackOfficeBusiness, BackOfficeBusiness>();

            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IUserBusiness, UserBusiness>();

            services.AddTransient<IElasticSearchSyncBusiness, ElasticSearchSyncBusiness>();
            services.AddTransient<IElasticSearchSyncService, ElasticSearchSyncService>();

            services.AddTransient<ICommonBusiness, CommonBusiness>();
            services.AddTransient<ICommonService, CommonService>();

            services.AddTransient<INotificationBusiness, NotificationBusiness>();
            services.AddTransient<INotificationService, NotificationService>();

            services.AddTransient<IPrintingBusiness, PrintingBusiness>();
            services.AddTransient<IPrintingService, PrintingService>();

            services.AddTransient<IPurchaseReportBusiness, PurchaseReportBusiness>();
            services.AddTransient<IEmailBusiness, EmailBusiness>();
            services.AddTransient<IInventoryBusiness, InventoryBusiness>();

            services.AddTransient<IDynamicDataService, DynamicDataService>();
            services.AddTransient<IShipmentBusiness, ShipmentBusiness>();

            #region Selection
            services.AddTransient<IProjectService, ProjectService>();
            services.AddTransient<IProjectBusiness, ProjectBusiness>();

            services.AddTransient<ICountryService, CountryService>();
            services.AddTransient<ICountryBusiness, CountryBusiness>();

            services.AddTransient<IDatabaseService, DatabaseService>();
            services.AddTransient<IDatabaseBusiness, DatabaseBusiness>();

            services.AddTransient<IRuleService, RuleService>();
            services.AddTransient<IRuleBusiness, RuleBusiness>();

            services.AddTransient<IFrequencyService, FrequencyService>();
            services.AddTransient<IFrequencyBusiness, FrequencyBusiness>();

            services.AddTransient<ISelectionExportService, SelectionExportService>();
            services.AddTransient<ISelectionExportBusiness, SelectionExportBusiness>();
            #endregion

            services.TryAddSingleton<IImageResizer, ImageResizer>();
            services.TryAddSingleton<IPathProvider, PathProvider>();
            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            #endregion
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddDebug();

            if (Configuration["AppSettings:EnableLog4Net"] == "True")
            {
                if (Directory.Exists(env.ContentRootPath) && File.Exists(Path.Combine(env.ContentRootPath, "log4net.config")))
                {
                    loggerFactory.AddLog4Net();
                }
            }

            //must be called before app.UseMvc.
            app.UseResponseCompression();

            #region ApplicationInsightsRequestTelemetry
#pragma warning disable CS0612 // Type or member is obsolete
            app.UseApplicationInsightsRequestTelemetry();
#pragma warning restore CS0612 // Type or member is obsolete

#pragma warning disable CS0612 // Type or member is obsolete
            app.UseApplicationInsightsExceptionTelemetry();
#pragma warning restore CS0612 // Type or member is obsolete            
            #endregion

            #region Cors
            // REF: https://docs.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-2.1
            // global cors policy
            app.UseCors(builder => builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());
            #endregion

            #region Swagger
            if (env.IsDevelopment())
            {
                // Enable middleware to serve generated Swagger as a JSON endpoint.
                app.UseSwagger();

                // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), 
                // specifying the Swagger JSON endpoint.
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "XenaUI API V1");
                });
            }
            #endregion

            app.UseAuthentication();
            app.UseMiddleware<ProcessingMiddleware>();
            app.Use(async (context, next) =>
            {
                await next();
                if (context.Response.StatusCode == 404 &&
                !Path.HasExtension(context.Request.Path.Value))
                {
                    context.Request.Path = "/index.html";
                    await next();
                }
            })
            .UseDefaultFiles(new DefaultFilesOptions { DefaultFileNames = new List<string> { "index.html" } })
            .UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot")),
                RequestPath = new PathString("")
            })
            .UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }

        #region Jwt
        /// <summary>
        /// Configure Jwt
        /// </summary>
        /// <param name="services"></param>
        private void ConfigureJwt(IServiceCollection services)
        {
            //http://jasonwatmore.com/post/2018/08/14/aspnet-core-21-jwt-authentication-tutorial-with-example-api
            //http://jasonwatmore.com/post/2018/06/26/aspnet-core-21-simple-api-for-authentication-registration-and-user-management

            #region JwtIssuerOptions
            // Get options from "appsetting.json" file
            var jwtAppSettingOptions = Configuration.GetSection(nameof(JwtIssuerOptions));

            // Configure JwtIssuerOptions
            services.Configure<JwtIssuerOptions>(options =>
            {
                options.Issuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
                options.Audience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)];
                options.SigningCredentials = new SigningCredentials(OAuthSigningKey, SecurityAlgorithms.HmacSha256);
            });
            #endregion

            #region Authentication
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)],

                ValidateAudience = true,
                ValidAudience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)],

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = OAuthSigningKey,

                RequireExpirationTime = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(configureOptions =>
            {
                configureOptions.ClaimsIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
                configureOptions.TokenValidationParameters = tokenValidationParameters;
                configureOptions.SaveToken = true;
            });
            #endregion

            #region Authorization
            // api user claim policy
            services.AddAuthorization(options =>
            {
                options.AddPolicy(ConstAuth.UserRoleKey,
                                  policy => policy.RequireClaim(ConstAuth.RoleKey, ConstAuth.RoleAdminKey));
            });
            #endregion
        }
        #endregion
    }
}
