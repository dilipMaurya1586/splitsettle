package com.splitsettle.aiservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.splitsettle.aiservice.dto.ParsedExpenseResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ExpenseParsingService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 🔥 PROMPT DIRECT STRING MEIN DEFINE KIYA HAI
    private static final String SYSTEM_PROMPT =
            "You are an expense-parsing assistant for a group expense-splitting app.\n" +
                    "Given a natural language sentence describing a shared expense, extract structured data.\n" +
                    "\n" +
                    "Respond ONLY with valid JSON in exactly this format, no extra text, no markdown fences:\n" +
                    "{\n" +
                    "  \"description\": \"<short description of what was purchased>\",\n" +
                    "  \"amount\": <numeric total amount>,\n" +
                    "  \"participantNames\": [\"<name1>\", \"<name2>\", ...],\n" +
                    "  \"splitType\": \"EQUAL\"\n" +
                    "}\n" +
                    "\n" +
                    "Rules:\n" +
                    "- \"participantNames\" should include everyone splitting the expense, INCLUDING the payer if they said \"split with me and X\" or similar. If the payer says \"split with Ravi and Sam\" without mentioning themselves, still include the implicit payer is NOT in the list (only list the others explicitly mentioned) unless they say \"we split\" or \"split between us\".\n" +
                    "- splitType is always \"EQUAL\" unless the sentence explicitly mentions percentages or exact amounts per person.\n" +
                    "- amount must be a plain number, no currency symbols.";

    public ExpenseParsingService(ChatClient.Builder chatClientBuilder) {
        // 🔥 DIRECT SYSTEM MESSAGE SET KIYA HAI
        this.chatClient = chatClientBuilder
                .defaultSystem(SYSTEM_PROMPT)
                .build();
    }

    public ParsedExpenseResponse parse(String naturalLanguageInput) {
        // 🔥 FAKE / MOCK RESPONSE (Bina OpenAI ke)
        return new ParsedExpenseResponse("Dinner", new BigDecimal("800"), List.of("Ravi", "Sam"), "EQUAL");
    }
//    public ParsedExpenseResponse parse(String naturalLanguageInput) {
//        // 🔥 DIRECT USER MESSAGE BHEJA HAI
//        String rawResponse = chatClient.prompt()
//                .user(naturalLanguageInput)
//                .call()
//                .content();
//
//        try {
//            String cleaned = rawResponse.replaceAll("```json|```", "").trim();
//            return objectMapper.readValue(cleaned, ParsedExpenseResponse.class);
//        } catch (Exception e) {
//            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
//                    "Could not parse expense from input: " + e.getMessage());
//        }
//    }
}