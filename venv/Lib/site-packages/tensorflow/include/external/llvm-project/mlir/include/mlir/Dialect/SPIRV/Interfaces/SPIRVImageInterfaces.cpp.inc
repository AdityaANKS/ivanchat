/*===- TableGen'erated file -------------------------------------*- C++ -*-===*\
|*                                                                            *|
|* Interface Definitions                                                      *|
|*                                                                            *|
|* Automatically generated file, do not edit!                                 *|
|*                                                                            *|
\*===----------------------------------------------------------------------===*/


/// Get SampledImage of the operation.
::mlir::TypedValue<::mlir::Type> mlir::spirv::ExplicitLodOpInterface::getSampledImage() {
      return getImpl()->implSamplingOpInterface->getSampledImage(getImpl()->implSamplingOpInterface, getOperation());
  }

/// Get Coordinate of the operation.
::mlir::TypedValue<::mlir::Type> mlir::spirv::ExplicitLodOpInterface::getCoordinate() {
      return getImpl()->implSamplingOpInterface->getCoordinate(getImpl()->implSamplingOpInterface, getOperation());
  }

/// Get Image of the operation.
::mlir::TypedValue<::mlir::Type> mlir::spirv::FetchOpInterface::getImage() {
      return getImpl()->getImage(getImpl(), getOperation());
  }

/// Get SampledImage of the operation.
::mlir::TypedValue<::mlir::Type> mlir::spirv::ImplicitLodOpInterface::getSampledImage() {
      return getImpl()->implSamplingOpInterface->getSampledImage(getImpl()->implSamplingOpInterface, getOperation());
  }

/// Get Coordinate of the operation.
::mlir::TypedValue<::mlir::Type> mlir::spirv::ImplicitLodOpInterface::getCoordinate() {
      return getImpl()->implSamplingOpInterface->getCoordinate(getImpl()->implSamplingOpInterface, getOperation());
  }

/// Get SampledImage of the operation.
::mlir::TypedValue<::mlir::Type> mlir::spirv::SamplingOpInterface::getSampledImage() {
      return getImpl()->getSampledImage(getImpl(), getOperation());
  }

/// Get Coordinate of the operation.
::mlir::TypedValue<::mlir::Type> mlir::spirv::SamplingOpInterface::getCoordinate() {
      return getImpl()->getCoordinate(getImpl(), getOperation());
  }
