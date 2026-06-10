using System.ComponentModel.DataAnnotations;

namespace TaskManager.api.Dtos;

public class CreateTaskDto
{
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [RegularExpression("Low|Medium|High")]
    public string Priority { get; set; } = "Medium";

    [Required]
    [RegularExpression("Pending|InProgress|Done")]
    public string Status { get; set; } = "Pending";

    // ⭐ FIXED: no [Required], nullable type
    public DateTime? DueDate { get; set; }
}
