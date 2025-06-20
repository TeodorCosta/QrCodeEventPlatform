package com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.service;

import com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.entity.Photo;
import com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.entity.QrSession;
import com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.repository.PhotoRepository;
import com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.repository.QrSessionRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PhotoService {

    @Autowired
    private PhotoRepository photoRepository;

    @Autowired
    private QrSessionRepository qrSessionRepository;

    public void uploadPhotos(String name, String sessionId, MultipartFile[] photos) throws IOException {
        QrSession session = qrSessionRepository.findByQrCode(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid session ID"));

        for (MultipartFile photo : photos) {
            Photo photoEntity = new Photo();
            photoEntity.setOwnerName(name);
            photoEntity.setQrSession(session);
            photoEntity.setImageData(photo.getBytes());
            photoRepository.save(photoEntity);
        }
    }

    public List<Photo> getPhotos(Long sessionId) {
        return photoRepository.findByQrSessionId(sessionId);
    }
    @Transactional(readOnly = true)
    public List<Photo> getPhotosBySessionId(Long sessionId) {
        return photoRepository.findByQrSessionId(sessionId);
    }
    public Photo getPhotoById(Long photoId) {
        return photoRepository.findById(photoId)
                .orElseThrow(() -> new RuntimeException("Photo not found with ID: " + photoId));
    }
}
