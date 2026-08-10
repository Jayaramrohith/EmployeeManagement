using employeeapis.DTOs;
using employeeapis.Models;
using AutoMapper;

namespace employeeapis.Mappings;

public class EmployeeProfile : Profile
{
    public EmployeeProfile()
    {
        CreateMap<Employee, EmployeeResponseDto>();
        CreateMap<EmployeeCreateDto, Employee>();
        CreateMap<EmployeeUpdateDto, Employee>();
    }
}
