package com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.controller;

import com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.entity.Photo;
import com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/photos")
public class PhotoController {

    @Autowired
    private PhotoService photoService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadPhotos(
            @RequestParam("name") String name,
            @RequestParam("sessionId") String sessionId,
            @RequestParam("photos") MultipartFile[] photos) {
        try {
            photoService.uploadPhotos(name, sessionId, photos);
            return ResponseEntity.ok("Photos uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<List<Photo>> getPhotos(@PathVariable Long sessionId) {
        List<Photo> photos = photoService.getPhotos(sessionId);
        return ResponseEntity.ok(photos);
    }
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<Long>> getPhotoIdsBySession(@PathVariable Long sessionId) {
        List<Photo> photos = photoService.getPhotosBySessionId(sessionId);
        List<Long> photoIds = photos.stream().map(Photo::getId).toList();
        return ResponseEntity.ok(photoIds);
    }

    @GetMapping("/download/{photoId}")
    public ResponseEntity<byte[]> getPhoto(@PathVariable Long photoId) {
        Photo photo = photoService.getPhotoById(photoId);
        if (photo.getImageData() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header("Content-Type", "image/jpeg")
                .body(photo.getImageData());
    }



}

