package com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.repository;

import com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.entity.QrSession;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QrSessionRepository extends JpaRepository<QrSession, Long> {
    @Query("SELECT q FROM QrSession q WHERE q.qrCode = :qrCode")
    Optional<QrSession> findByQrCode(@Param("qrCode") String qrCode);
}
