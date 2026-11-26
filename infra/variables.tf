variable "environment" {
  description = "Environment name (staging or production)"
  type        = string
  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "Environment must be either 'staging' or 'production'."
  }
}

variable "domain" {
  description = "Primary host of the site (production name; staging gets a staging. prefix)"
  type        = string
  default     = "smrt.happyvertical.com"
}

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-west-2"
}

variable "github_repository" {
  description = "GitHub repository in format 'owner/repo'"
  type        = string
  default     = "happyvertical/s-m-r-t.dev"
}

variable "hosted_zone_name" {
  description = "Route53 hosted zone that holds the primary host's records, when it is not the domain itself (a host inside a parent zone, such as smrt.happyvertical.com in happyvertical.com). Defaults to var.domain."
  type        = string
  default     = null
}

variable "old_domain" {
  description = "The host the site moved from (production name; staging gets a staging. prefix). While set, the distribution also serves it (alias, certificate subject alternative name, record in its own zone). Unset it to drop the old host; var.domain is never affected."
  type        = string
  default     = null
}

variable "old_hosted_zone_name" {
  description = "Route53 zone that holds the old host's records. Defaults to var.old_domain."
  type        = string
  default     = null
}

variable "redirect_old_domain" {
  description = "When true, the main viewer-request function answers requests for var.old_domain with one 301 to the same path and query on var.domain. Needs old_domain."
  type        = bool
  default     = false

  validation {
    condition     = !var.redirect_old_domain || var.old_domain != null
    error_message = "redirect_old_domain needs old_domain."
  }
}
