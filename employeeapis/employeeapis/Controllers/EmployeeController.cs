using employeeapis.Common;
using employeeapis.DTOs;
using employeeapis.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
namespace employeeapis.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]

public class EmployeeController : ControllerBase
{
    private readonly IEmployeeService _employeeService;
    private readonly ILogger<EmployeeController> _logger;

    public EmployeeController(IEmployeeService employeeService, ILogger<EmployeeController> logger)
    {
        _employeeService = employeeService;
        _logger = logger;
    }

    /// <summary>
    /// Get paginated employees with optional search and sorting.
    /// </summary>
    [AllowAnonymous]
    [HttpGet]

    [ProducesResponseType(typeof(ApiResponse<PagedResponse<EmployeeResponseDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<PagedResponse<EmployeeResponseDto>>>> GetEmployees(
        [FromQuery] EmployeeQueryParameters parameters,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(CreateValidationErrorResponse());
        }

        _logger.LogInformation("GET /api/employee requested");

        var result = await _employeeService.GetEmployeesAsync(parameters, cancellationToken);

        return Ok(ApiResponse<PagedResponse<EmployeeResponseDto>>.SuccessResponse(
            result,
            "Employees retrieved successfully."));
    }

    /// <summary>
    /// Get an employee by id.
    /// </summary>
    [AllowAnonymous]
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<EmployeeResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<EmployeeResponseDto>>> GetEmployee(
        int id,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("GET /api/employee/{EmployeeId} requested", id);

        var employee = await _employeeService.GetEmployeeByIdAsync(id, cancellationToken);

        return Ok(ApiResponse<EmployeeResponseDto>.SuccessResponse(
            employee,
            "Employee retrieved successfully."));
    }

    /// <summary>
    /// Create a new employee.
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<EmployeeResponseDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApiResponse<EmployeeResponseDto>>> CreateEmployee(
        [FromBody] EmployeeCreateDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(CreateValidationErrorResponse());
        }

        _logger.LogInformation("POST /api/employee requested");

        var employee = await _employeeService.CreateEmployeeAsync(dto, cancellationToken);

        return CreatedAtAction(
            nameof(GetEmployee),
            new { id = employee.Id },
            ApiResponse<EmployeeResponseDto>.SuccessResponse(
                employee,
                "Employee created successfully."));
    }

    /// <summary>
    /// Update an existing employee.
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<EmployeeResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApiResponse<EmployeeResponseDto>>> UpdateEmployee(
        int id,
        [FromBody] EmployeeUpdateDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(CreateValidationErrorResponse());
        }

        _logger.LogInformation("PUT /api/employee/{EmployeeId} requested", id);

        var employee = await _employeeService.UpdateEmployeeAsync(id, dto, cancellationToken);

        return Ok(ApiResponse<EmployeeResponseDto>.SuccessResponse(
            employee,
            "Employee updated successfully."));
    }

    /// <summary>
    /// Delete an employee.
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteEmployee(int id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("DELETE /api/employee/{EmployeeId} requested", id);

        await _employeeService.DeleteEmployeeAsync(id, cancellationToken);

        return NoContent();
    }

    private ApiResponse<object> CreateValidationErrorResponse()
    {
        var errors = ModelState.Values
            .SelectMany(v => v.Errors)
            .Select(e => e.ErrorMessage);

        return ApiResponse<object>.FailureResponse("Validation failed.", errors);
    }
}
