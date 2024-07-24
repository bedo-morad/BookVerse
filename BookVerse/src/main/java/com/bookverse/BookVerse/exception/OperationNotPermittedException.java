package com.bookverse.BookVerse.exception;

public class OperationNotPermittedException extends RuntimeException {
    public OperationNotPermittedException(String msg) {
        super(msg);
    }
}
