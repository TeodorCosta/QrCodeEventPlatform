package com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.controller;

import com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.entity.Photo;
import com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.service.PhotoService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/photos")
@AllArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadPhotos(
            @RequestParam("name") String name,
            @RequestParam("sessionId") String sessionId,
            @RequestParam("photos") MultipartFile[] photos) {
        try {
            if (photos == null || photos.length == 0) {
                return ResponseEntity.badRequest().body("No photos uploaded");
            }

            for (MultipartFile file : photos) {
                if (file.isEmpty()) {
                    return ResponseEntity.badRequest().body("One or more uploaded files are empty");
                }

                String contentType = file.getContentType();
                String fileName = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";

                boolean isImage = contentType != null && contentType.startsWith("image/")
                        && (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")
                        || fileName.endsWith(".png") || fileName.endsWith(".gif")
                        || fileName.endsWith(".bmp") || fileName.endsWith(".webp"));

                if (!isImage) {
                    return ResponseEntity.badRequest()
                            .body("Invalid file type: " + file.getOriginalFilename() + " — only image files are allowed.");
                }
            }

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
    //TODO Namefiltering not working ideally
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<Long>> getPhotoIdsBySession(@PathVariable Long sessionId,@RequestParam(required = false) String name){
        List<Photo> photos = photoService.getPhotosBySessionId(sessionId);
        List<Long> photoIds ;
        if (name != null && !name.trim().isEmpty()) {
            photoIds = photos.stream()
                    .filter(photo -> name.equalsIgnoreCase(photo.getOwnerName()))
                    .map(Photo::getId)
                    .toList();
        } else {
            photoIds = photos.stream()
                    .map(Photo::getId)
                    .toList();
        }
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

