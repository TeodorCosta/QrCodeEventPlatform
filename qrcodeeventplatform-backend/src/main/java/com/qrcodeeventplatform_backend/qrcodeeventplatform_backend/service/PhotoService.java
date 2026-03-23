package com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.service;

import com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.entity.Photo;
import com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.entity.QrSession;
import com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.repository.PhotoRepository;
import com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.repository.QrSessionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class PhotoService {

    @Value("${app.upload.photos-dir:uploads/photos}")
    private String photosDirectory;

    @Autowired
    private PhotoRepository photoRepository;

    @Autowired
    private QrSessionRepository qrSessionRepository;

    public void uploadPhotos(String name, String sessionId, MultipartFile[] photos) throws IOException {
        QrSession session = qrSessionRepository.findByQrCode(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid session ID"));

        Path uploadRoot = Paths.get(photosDirectory).toAbsolutePath().normalize();
        Files.createDirectories(uploadRoot);

        for (MultipartFile photo : photos) {
            String originalName = photo.getOriginalFilename() != null ? photo.getOriginalFilename() : "photo";
            String sanitizedOriginalName = Paths.get(originalName).getFileName().toString().replaceAll("\\s+", "_");
            String storedFileName = UUID.randomUUID() + "_" + sanitizedOriginalName;
            Path destination = uploadRoot.resolve(storedFileName).normalize();

            if (!destination.startsWith(uploadRoot)) {
                throw new IllegalArgumentException("Invalid photo path");
            }

            Files.copy(photo.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            Photo photoEntity = new Photo();
            photoEntity.setOwnerName(name);
            photoEntity.setQrSession(session);
            photoEntity.setFilePath(destination.toString());
            photoEntity.setContentType(photo.getContentType());
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

    public byte[] loadPhotoBytes(Photo photo) throws IOException {
        if (photo.getFilePath() == null || photo.getFilePath().isBlank()) {
            return null;
        }
        Path photoPath = Paths.get(photo.getFilePath());
        if (!Files.exists(photoPath)) {
            return null;
        }
        return Files.readAllBytes(photoPath);
    }
}
