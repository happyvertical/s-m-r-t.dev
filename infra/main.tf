terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
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

  environment       = var.environment
  domain            = var.domain
  aws_region        = var.aws_region
  github_repository = var.github_repository

  providers = {
    aws.us_east_1 = aws.us_east_1
  }
}
