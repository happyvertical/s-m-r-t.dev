variable "environment" {
  description = "Environment name (staging or production)"
  type        = string
  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "Environment must be either 'staging' or 'production'."
  }
}

variable "domain" {
  description = "Base domain for the site"
  type        = string
  default     = "havesmrt.com"
}

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-west-2"
}

variable "kubeconfig_path" {
  description = "Path to kubeconfig file for Kubernetes backend"
  type        = string
  default     = "~/.kube/have-rickety.config"
}
