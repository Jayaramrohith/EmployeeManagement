using employeeapis.Common;
using employeeapis.Data;
using employeeapis.DTOs;
using employeeapis.Models;
using Microsoft.EntityFrameworkCore;

namespace employeeapis.Repositories;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly ApplicationDbContext _context;

    public EmployeeRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<Employee>> GetPagedAsync(
        EmployeeQueryParameters parameters,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Employees.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(parameters.SearchName))
        {
            query = query.Where(e => e.Name.Contains(parameters.SearchName));
        }

        if (!string.IsNullOrWhiteSpace(parameters.SearchDepartment))
        {
            query = query.Where(e => e.Department.Contains(parameters.SearchDepartment));
        }

        query = ApplySorting(query, parameters.SortBy, parameters.SortOrder);

        var totalCount = await query.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling(totalCount / (double)parameters.PageSize);

        var items = await query
            .Skip((parameters.PageNumber - 1) * parameters.PageSize)
            .Take(parameters.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResponse<Employee>
        {
            Items = items,
            PageNumber = parameters.PageNumber,
            PageSize = parameters.PageSize,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasPrevious = parameters.PageNumber > 1,
            HasNext = parameters.PageNumber < totalPages
        };
    }

    public async Task<Employee?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            return await _context.Employees.FindAsync(new object[] { id }, cancellationToken);
        }
        catch (OperationCanceledException)
        {
            return null;
        }
    }
    public async Task<bool> EmailExistsAsync(
        string email,
        int? excludeId = null,
        CancellationToken cancellationToken = default)
    {
        return await _context.Employees
            .AnyAsync(e => e.Email == email && (!excludeId.HasValue || e.Id != excludeId.Value), cancellationToken);
    }

    public async Task<Employee> AddAsync(Employee employee, CancellationToken cancellationToken = default)
    {
        _context.Employees.Add(employee);
        await _context.SaveChangesAsync(cancellationToken);
        return employee;
    }

    public async Task UpdateAsync(Employee employee, CancellationToken cancellationToken = default)
    {
        _context.Employees.Update(employee);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Employee employee, CancellationToken cancellationToken = default)
    {
        _context.Employees.Remove(employee);
        await _context.SaveChangesAsync(cancellationToken);
    }

    private static IQueryable<Employee> ApplySorting(IQueryable<Employee> query, string sortBy, string sortOrder)
    {
        var isDescending = sortOrder.Equals("desc", StringComparison.OrdinalIgnoreCase);

        return sortBy.ToLowerInvariant() switch
        {
            "salary" => isDescending
                ? query.OrderByDescending(e => e.Salary)
                : query.OrderBy(e => e.Salary),
            _ => isDescending
                ? query.OrderByDescending(e => e.Name)
                : query.OrderBy(e => e.Name)
        };
    }
}
