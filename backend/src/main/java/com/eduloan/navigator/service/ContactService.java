package com.eduloan.navigator.service;

import com.eduloan.navigator.dto.ContactQueryDto;
import com.eduloan.navigator.model.ContactQuery;
import com.eduloan.navigator.repository.ContactQueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactService {

    @Autowired
    private ContactQueryRepository queryRepository;

    @Transactional
    public ContactQuery submitQuery(ContactQueryDto dto) {
        ContactQuery query = new ContactQuery(
                dto.getName(),
                dto.getEmail(),
                dto.getSubject(),
                dto.getMessage()
        );
        return queryRepository.save(query);
    }

    public List<ContactQueryDto> getAllQueries() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return queryRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(q -> {
                    ContactQueryDto dto = new ContactQueryDto();
                    dto.setId(q.getId());
                    dto.setName(q.getName());
                    dto.setEmail(q.getEmail());
                    dto.setSubject(q.getSubject());
                    dto.setMessage(q.getMessage());
                    dto.setStatus(q.getStatus());
                    dto.setReplyMessage(q.getReplyMessage());
                    dto.setCreatedAt(q.getCreatedAt().format(formatter));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public ContactQuery replyToQuery(Long id, String replyMessage) {
        ContactQuery query = queryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Query not found with id: " + id));
        query.setReplyMessage(replyMessage);
        query.setStatus("RESOLVED");
        return queryRepository.save(query);
    }
}
