package com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.repository;

import com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.entity.Photo;
import com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.entity.QrSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findByQrSessionId(Long sessionId);
}
