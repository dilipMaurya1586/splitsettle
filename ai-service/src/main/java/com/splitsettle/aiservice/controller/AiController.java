package com.splitsettle.aiservice.controller;
import com.splitsettle.aiservice.dto.ParseExpenseRequest;
import com.splitsettle.aiservice.dto.ParsedExpenseResponse;
import com.splitsettle.aiservice.service.ExpenseParsingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final ExpenseParsingService parsingService;

    public AiController(ExpenseParsingService parsingService) {
        this.parsingService = parsingService;
    }

    // e.g. { "naturalLanguageInput": "I paid 800 for dinner, split with Ravi and Sam" }
    @PostMapping("/parse-expense")
    public ResponseEntity<ParsedExpenseResponse> parseExpense(@Valid @RequestBody ParseExpenseRequest request) {
        return ResponseEntity.ok(parsingService.parse(request.naturalLanguageInput()));
    }
}
