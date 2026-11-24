variable "environment" {
  description = "Environment name (staging or production)"
  type        = string
}

variable "domain" {
  description = "Base domain for the site"
  type        = string
}

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
}

variable "github_repository" {
  description = "GitHub repository in format 'owner/repo'"
  type        = string
}

variable "hosted_zone_name" {
  description = "Route53 hosted zone that holds the site records, when it is not the domain itself (a host inside a parent zone, such as smrt.happyvertical.com in happyvertical.com). Defaults to var.domain."
  type        = string
  default     = null
}

variable "new_domain" {
  description = "The host the site is moving to (production name; staging gets a staging. prefix). While set, the main distribution also serves it (alias, certificate name, record), and var.domain keeps serving too. Null means no move."
  type        = string
  default     = null
}

variable "new_hosted_zone_name" {
  description = "Route53 hosted zone that holds the new host's records. Defaults to var.new_domain."
  type        = string
  default     = null
}

variable "redirect_to_new_domain" {
  description = "When true, the main viewer-request function answers requests for var.domain (the old host) with one 301 to the same path and query on var.new_domain. Needs new_domain."
  type        = bool
  default     = false

  validation {
    condition     = !var.redirect_to_new_domain || var.new_domain != null
    error_message = "redirect_to_new_domain needs new_domain."
  }
}
