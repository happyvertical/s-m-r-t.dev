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
