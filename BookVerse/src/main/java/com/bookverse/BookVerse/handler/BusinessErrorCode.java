package com.bookverse.BookVerse.handler;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

public enum BusinessErrorCode {
    NO_CODE(0, NOT_IMPLEMENTED, "No Code"),
    INCORRECT_CURRENT_PASSWORD(300, BAD_REQUEST, "Current Password Is incorrect"),
    NEW_PASSWORD_DOES_NOT_MATCH(301, BAD_REQUEST, "The new password doesn't match"),
    ACCOUNT_LOCKED(302, FORBIDDEN, "User Account is Locked"),
    ACCOUNT_Disabled(303, FORBIDDEN, "User Account is disabled"),
    BAD_CREDENTIALS(304, FORBIDDEN, "email and / or password is incorrect"),
    ;
    @Getter
    private final int code;
    @Getter
    private final HttpStatus httpStatus;
    @Getter
    private final String description;

    BusinessErrorCode(int code, HttpStatus httpStatus, String description) {
        this.code = code;
        this.description = description;
        this.httpStatus = httpStatus;
    }
}
