package com.splitsettle.aiservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.splitsettle.aiservice.dto.ParsedExpenseResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ExpenseParsingService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

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
                    "- \"participantNames\" should include everyone splitting the expense, INCLUDING the payer if they said \"split with me and X\" or similar.\n" +
                    "- splitType is always \"EQUAL\" unless the sentence explicitly mentions percentages or exact amounts per person.\n" +
                    "- amount must be a plain number, no currency symbols.";

    public ExpenseParsingService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public ParsedExpenseResponse parse(String naturalLanguageInput) {
        // ✅ Using raw SystemMessage/UserMessage via Prompt instead of
        // .system(String)/.user(String) — those go through Spring AI's
        // StringTemplate (ST4) renderer, which treats the literal '{' '}'
        // in our JSON example as template syntax and throws
        // STException: "came as a complete surprise to me".
        // Passing pre-built Message objects skips templating entirely.
        Prompt prompt = new Prompt(List.of(
                new SystemMessage(SYSTEM_PROMPT),
                new UserMessage(naturalLanguageInput)
        ));

        String rawResponse = chatClient.prompt(prompt)
                .call()
                .content();

        try {
            String cleaned = rawResponse.replaceAll("```json|```", "").trim();
            return objectMapper.readValue(cleaned, ParsedExpenseResponse.class);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "Could not parse expense from input: " + e.getMessage());
        }
    }
}
//package com.splitsettle.aiservice.service;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.splitsettle.aiservice.dto.ParsedExpenseResponse;
//import org.springframework.ai.chat.client.ChatClient;
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Service;
//import org.springframework.web.server.ResponseStatusException;
//
//@Service
//public class ExpenseParsingService {
//
//    private final ChatClient chatClient;
//    private final ObjectMapper objectMapper = new ObjectMapper();
//
//    private static final String SYSTEM_PROMPT =
//            "You are an expense-parsing assistant for a group expense-splitting app.\n" +
//                    "Given a natural language sentence describing a shared expense, extract structured data.\n" +
//                    "\n" +
//                    "Respond ONLY with valid JSON in exactly this format, no extra text, no markdown fences:\n" +
//                    "{\n" +
//                    "  \"description\": \"<short description of what was purchased>\",\n" +
//                    "  \"amount\": <numeric total amount>,\n" +
//                    "  \"participantNames\": [\"<name1>\", \"<name2>\", ...],\n" +
//                    "  \"splitType\": \"EQUAL\"\n" +
//                    "}\n" +
//                    "\n" +
//                    "Rules:\n" +
//                    "- \"participantNames\" should include everyone splitting the expense, INCLUDING the payer if they said \"split with me and X\" or similar.\n" +
//                    "- splitType is always \"EQUAL\" unless the sentence explicitly mentions percentages or exact amounts per person.\n" +
//                    "- amount must be a plain number, no currency symbols.";
//
//    public ExpenseParsingService(ChatClient.Builder chatClientBuilder) {
//        this.chatClient = chatClientBuilder.build();
//    }
//
//    public ParsedExpenseResponse parse(String naturalLanguageInput) {
//        String rawResponse = chatClient.prompt()
//                .system(SYSTEM_PROMPT)
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
//}