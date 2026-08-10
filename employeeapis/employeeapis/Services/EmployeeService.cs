using AutoMapper;
using employeeapis.Common;
using employeeapis.DTOs;
using employeeapis.Exceptions;
using employeeapis.Models;
using employeeapis.Repositories;

namespace employeeapis.Services;

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<EmployeeService> _logger;

    public EmployeeService(
        IEmployeeRepository repository,
        IMapper mapper,
        ILogger<EmployeeService> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PagedResponse<EmployeeResponseDto>> GetEmployeesAsync(
        EmployeeQueryParameters parameters,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation(
            "Fetching employees. Page: {PageNumber}, Size: {PageSize}, SortBy: {SortBy}, SortOrder: {SortOrder}",
            parameters.PageNumber,
            parameters.PageSize,
            parameters.SortBy,
            parameters.SortOrder);

        var pagedEmployees = await _repository.GetPagedAsync(parameters, cancellationToken);

        return new PagedResponse<EmployeeResponseDto>
        {
            Items = _mapper.Map<IEnumerable<EmployeeResponseDto>>(pagedEmployees.Items),
            PageNumber = pagedEmployees.PageNumber,
            PageSize = pagedEmployees.PageSize,
            TotalCount = pagedEmployees.TotalCount,
            TotalPages = pagedEmployees.TotalPages,
            HasPrevious = pagedEmployees.HasPrevious,
            HasNext = pagedEmployees.HasNext
        };
    }

    public async Task<EmployeeResponseDto> GetEmployeeByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Fetching employee with id {EmployeeId}", id);

        var employee = await _repository.GetByIdAsync(id, cancellationToken);

        if (employee is null)
        {
            _logger.LogWarning("Employee with id {EmployeeId} not found", id);
            throw new NotFoundException($"Employee with id {id} was not found.");
        }

        return _mapper.Map<EmployeeResponseDto>(employee);
    }

    public async Task<EmployeeResponseDto> CreateEmployeeAsync(
        EmployeeCreateDto dto,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating employee with email {Email}", dto.Email);

        if (await _repository.EmailExistsAsync(dto.Email, cancellationToken: cancellationToken))
        {
            _logger.LogWarning("Attempted to create employee with duplicate email {Email}", dto.Email);
            throw new ConflictException("An employee with this email already exists.");
        }

        var employee = _mapper.Map<Employee>(dto);
        var createdEmployee = await _repository.AddAsync(employee, cancellationToken);

        _logger.LogInformation("Employee created with id {EmployeeId}", createdEmployee.Id);

        return _mapper.Map<EmployeeResponseDto>(createdEmployee);
    }

    public async Task<EmployeeResponseDto> UpdateEmployeeAsync(
        int id,
        EmployeeUpdateDto dto,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating employee with id {EmployeeId}", id);

        var employee = await _repository.GetByIdAsync(id, cancellationToken);

        if (employee is null)
        {
            _logger.LogWarning("Employee with id {EmployeeId} not found for update", id);
            throw new NotFoundException($"Employee with id {id} was not found.");
        }

        if (await _repository.EmailExistsAsync(dto.Email, id, cancellationToken))
        {
            _logger.LogWarning("Attempted to update employee {EmployeeId} with duplicate email {Email}", id, dto.Email);
            throw new ConflictException("An employee with this email already exists.");
        }

        _mapper.Map(dto, employee);
        await _repository.UpdateAsync(employee, cancellationToken);

        _logger.LogInformation("Employee with id {EmployeeId} updated successfully", id);

        return _mapper.Map<EmployeeResponseDto>(employee);
    }

    public async Task DeleteEmployeeAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deleting employee with id {EmployeeId}", id);

        var employee = await _repository.GetByIdAsync(id, cancellationToken);

        if (employee is null)
        {
            _logger.LogWarning("Employee with id {EmployeeId} not found for deletion", id);
            throw new NotFoundException($"Employee with id {id} was not found.");
        }

        await _repository.DeleteAsync(employee, cancellationToken);

        _logger.LogInformation("Employee with id {EmployeeId} deleted successfully", id);
    }
}
