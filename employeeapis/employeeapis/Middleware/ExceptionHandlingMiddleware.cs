using System.Net;
using System.Text.Json;
using employeeapis.Common;
using employeeapis.Exceptions;

namespace employeeapis.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly IHostEnvironment _environment;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger,
        IHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, message) = exception switch
        {
            NotFoundException notFound => (HttpStatusCode.NotFound, notFound.Message),
            ConflictException conflict => (HttpStatusCode.Conflict, conflict.Message),
            _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred.")
        };

        if (statusCode == HttpStatusCode.InternalServerError)
        {
            _logger.LogError(exception, "Unhandled exception occurred while processing {Method} {Path}",
                context.Request.Method,
                context.Request.Path);
        }
        else
        {
            _logger.LogWarning(exception, "Handled exception for {Method} {Path}: {Message}",
                context.Request.Method,
                context.Request.Path,
                message);
        }

        var errors = statusCode == HttpStatusCode.InternalServerError && _environment.IsDevelopment()
            ? new[] { exception.Message }
            : null;

        var response = ApiResponse<object>.FailureResponse(message, errors);

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        await context.Response.WriteAsync(JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        }));
    }
}
