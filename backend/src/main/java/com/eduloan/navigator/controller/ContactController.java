package com.eduloan.navigator.controller;

import com.eduloan.navigator.dto.ContactQueryDto;
import com.eduloan.navigator.model.ContactQuery;
import com.eduloan.navigator.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitQuery(@Valid @RequestBody ContactQueryDto queryDto) {
        ContactQuery query = contactService.submitQuery(queryDto);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Thank you! Your query has been submitted successfully.");
        response.put("queryId", query.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/reply")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> replyQuery(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String replyMessage = payload.get("replyMessage");
        if (replyMessage == null || replyMessage.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Reply message is required");
        }
        ContactQuery query = contactService.replyToQuery(id, replyMessage);
        return ResponseEntity.ok(query);
    }
}
