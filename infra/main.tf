terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "happyvertical-terraform-state"
    key    = "havesmrt/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

module "havesmrt" {
  source = "./modules/havesmrt"

  environment      = var.environment
  domain           = var.domain
  hosted_zone_name = var.hosted_zone_name

  new_domain             = var.new_domain
  new_hosted_zone_name   = var.new_hosted_zone_name
  redirect_to_new_domain = var.redirect_to_new_domain
  aws_region             = var.aws_region
  github_repository      = var.github_repository

  providers = {
    aws.us_east_1 = aws.us_east_1
  }
}
