package com.minjue;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.minjue.modules.*.mapper")
public class MinJueApplication {

    public static void main(String[] args) {
        SpringApplication.run(MinJueApplication.class, args);
        System.out.println("MinJue Backend Started Successfully");
        System.out.println("  ____                    ____  _     _ ____  _\n" +
                " |  _ \\  ___  _ __   __ / ___|| |__ (_)  _ \\(_)\n" +
                " | | | |/ _ \\| '_ \\ / _` \\___ \\| '_ \\| | | | | |\n" +
                " | |_| | (_) | | | | (_| |___) | | | | | |_| | |\n" +
                " |____/ \\___/|_| |_|\\__, |____/|_| |_|_|____/|_|\n" +
                "                    |___/\n");
    }
}
