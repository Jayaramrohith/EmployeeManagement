using employeeapis.Common;
using employeeapis.DTOs;

namespace employeeapis.Services;

public interface IEmployeeService
{
    Task<PagedResponse<EmployeeResponseDto>> GetEmployeesAsync(EmployeeQueryParameters parameters, CancellationToken cancellationToken = default);
    Task<EmployeeResponseDto> GetEmployeeByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<EmployeeResponseDto> CreateEmployeeAsync(EmployeeCreateDto dto, CancellationToken cancellationToken = default);
    Task<EmployeeResponseDto> UpdateEmployeeAsync(int id, EmployeeUpdateDto dto, CancellationToken cancellationToken = default);
    Task DeleteEmployeeAsync(int id, CancellationToken cancellationToken = default);
}
