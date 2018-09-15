package com.osa.front.projekat.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class Router {
	
	@RequestMapping("/")
	public String index() {
        return "index";
	}
	
	
	@RequestMapping("/modals")
	public String modals() {
		return "modals";
	}
	
	
	@RequestMapping("/nav")
	public String nav() {
		return "navigation";
	}
	
	@RequestMapping("/admin")
	public String admin() {
		return "admin";
	}
	
	
	@RequestMapping("/post/{id}")
	public String post(@PathVariable("id") String id) {	
        return "post";
	}
	
	@RequestMapping("/user/{id}")
	public String user(@PathVariable("id") String id) {
		return "user";
	}

}
