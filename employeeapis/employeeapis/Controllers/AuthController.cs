using employeeapis.Data;
using employeeapis.DTOs;
using employeeapis.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace employeeapis.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(
            ApplicationDbContext context,
            IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Register
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest(new { message = "Email and password are required." });
            }

            var email = dto.Email.Trim().ToLower();

            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == email))
            {
                return BadRequest(new { message = "Email already exists." });
            }

            var user = new User
            {
                FullName = dto.FullName,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Employee",
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "User registered successfully."
            });
        }

        // Login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest(new { message = "Email and password are required." });
            }

            var email = dto.Email.Trim().ToLower();

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email);

            if (user == null)
            {
                return Unauthorized(new { message = "User not found." });
            }

            bool isPasswordValid =
                BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                return Unauthorized(new { message = "Password is incorrect." });
            }

            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrWhiteSpace(jwtKey))
            {
                return StatusCode(500, new { message = "JWT Key is missing in appsettings.json." });
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    Convert.ToInt32(_configuration["Jwt:ExpiryMinutes"])),
                signingCredentials: credentials
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
            {
                token = tokenString,
                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.Role
                }
            });
        }
    }
}