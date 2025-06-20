package com.qrcodeeventplatform_backend.qrcodeeventplatform_backend.entity;

import jakarta.persistence.*;
import lombok.*;
@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Photo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //private String blobUrl;

    private String OwnerName;

    @Lob
    private byte[] imageData;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private QrSession qrSession;


}
