package com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.service;

import com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.entity.QrSession;
import com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.repository.QrSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class QrService {
    @Autowired
    private QrSessionRepository qrSessionRepository;


    public QrSession createSession() {
        QrSession session = new QrSession();
        session.setStartTime(LocalDateTime.now());
        session.setExpiresAt(LocalDateTime.now().plusHours(24));
        session.setQrCode(UUID.randomUUID().toString());
        return qrSessionRepository.save(session);
    }
    public void saveQrSession(QrSession session) {
        qrSessionRepository.save(session);
    }
    public List<QrSession> getAllSessions() {
        return qrSessionRepository.findAll();
    }
}
