using employeeapis.Common;
using employeeapis.DTOs;
using employeeapis.Models;

namespace employeeapis.Repositories;

public interface IEmployeeRepository
{
    Task<PagedResponse<Employee>> GetPagedAsync(EmployeeQueryParameters parameters, CancellationToken cancellationToken = default);
    Task<Employee?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> EmailExistsAsync(string email, int? excludeId = null, CancellationToken cancellationToken = default);
    Task<Employee> AddAsync(Employee employee, CancellationToken cancellationToken = default);
    Task UpdateAsync(Employee employee, CancellationToken cancellationToken = default);
    Task DeleteAsync(Employee employee, CancellationToken cancellationToken = default);
}
