package com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.controller;

import com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.entity.QrSession;
import com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.service.QrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/qrcode")
public class QrController {

    @Autowired
    private QrService qrService;

    @PostMapping
    public ResponseEntity<Map<String, String>> generateQrCode() {
        // Create unique session ID (this will be the QR code content)
        String sessionId = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusHours(24);

        // Save to database
        QrSession qrSession = new QrSession();
        qrSession.setQrCode(sessionId);
        qrSession.setStartTime(now);
        qrSession.setExpiresAt(expiresAt);
        qrService.saveQrSession(qrSession);

        // Send QR code value back to frontend
        Map<String, String> response = new HashMap<>();
        response.put("qrCode", sessionId);

        return ResponseEntity.ok(response);
    }
    @GetMapping("/qrsessions")
    public ResponseEntity<List<QrSession>> getAllSessions() {
        List<QrSession> sessions = qrService.getAllSessions();
        return ResponseEntity.ok(sessions);
    }

}
