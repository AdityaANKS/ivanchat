/*===- TableGen'erated file -------------------------------------*- C++ -*-===*\
|*                                                                            *|
|* Op Definitions                                                             *|
|*                                                                            *|
|* Automatically generated file, do not edit!                                 *|
|* From: AMDGPU.td                                                            *|
|*                                                                            *|
\*===----------------------------------------------------------------------===*/

#ifdef GET_OP_LIST
#undef GET_OP_LIST

::mlir::amdgpu::DPPOp,
::mlir::amdgpu::ExtPackedFp8Op,
::mlir::amdgpu::FatRawBufferCastOp,
::mlir::amdgpu::GatherToLDSOp,
::mlir::amdgpu::LDSBarrierOp,
::mlir::amdgpu::MFMAOp,
::mlir::amdgpu::PackedScaledTruncOp,
::mlir::amdgpu::PackedStochRoundFp8Op,
::mlir::amdgpu::PackedTrunc2xFp8Op,
::mlir::amdgpu::RawBufferAtomicCmpswapOp,
::mlir::amdgpu::RawBufferAtomicFaddOp,
::mlir::amdgpu::RawBufferAtomicFmaxOp,
::mlir::amdgpu::RawBufferAtomicSmaxOp,
::mlir::amdgpu::RawBufferAtomicUminOp,
::mlir::amdgpu::RawBufferLoadOp,
::mlir::amdgpu::RawBufferStoreOp,
::mlir::amdgpu::ScaledExtPackedOp,
::mlir::amdgpu::ScaledMFMAOp,
::mlir::amdgpu::SchedBarrierOp,
::mlir::amdgpu::SwizzleBitModeOp,
::mlir::amdgpu::TransposeLoadOp,
::mlir::amdgpu::WMMAOp
#endif  // GET_OP_LIST

#ifdef GET_OP_CLASSES
#undef GET_OP_CLASSES


//===----------------------------------------------------------------------===//
// Local Utility Method Definitions
//===----------------------------------------------------------------------===//

namespace mlir {
namespace amdgpu {

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU1(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!((true))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be any type, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU2(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!(((::llvm::isa<::mlir::Float8E5M2FNUZType>(type))) || ((::llvm::isa<::mlir::Float8E4M3FNUZType>(type))) || ((::llvm::isa<::mlir::Float8E5M2Type>(type))) || ((::llvm::isa<::mlir::Float8E4M3FNType>(type))) || (((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return ((::llvm::isa<::mlir::Float8E5M2FNUZType>(elementType))) || ((::llvm::isa<::mlir::Float8E4M3FNUZType>(elementType))) || ((::llvm::isa<::mlir::Float8E5M2Type>(elementType))) || ((::llvm::isa<::mlir::Float8E4M3FNType>(elementType))); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && (((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 1)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 2)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 3)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 4))))))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be f8E5M2FNUZ type or f8E4M3FNUZ type or f8E5M2 type or f8E4M3FN type or vector of f8E5M2FNUZ type or f8E4M3FNUZ type or f8E5M2 type or f8E4M3FN type values of length 1/2/3/4, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU3(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!(((type.isF32())) || ((((::llvm::isa<::mlir::FixedVectorType>(type))) && ([](::mlir::Type elementType) { return (elementType.isF32()); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && (((::llvm::isa<::mlir::FixedVectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 2)))))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be 32-bit float or fixed-length vector of 32-bit float values of length 2, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU4(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!(((::llvm::isa<::mlir::MemRefType>(type))) && ([](::mlir::Type elementType) { return (true); }(::llvm::cast<::mlir::ShapedType>(type).getElementType())))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be memref of any type values, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU5(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!((type.isSignlessInteger(32)))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be 32-bit signless integer, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU6(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!((type.isSignlessInteger(14)))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be 14-bit signless integer, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU7(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!((::llvm::isa<::mlir::IndexType>(type)))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be variadic of index, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU8(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!(((type.isF32())) || ((type.isF64())) || ((type.isSignlessInteger(32))) || ((type.isSignlessInteger(64))) || (((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return (elementType.isF32()); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 2)))) || (((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return (elementType.isF16()); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && (((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 4)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 8))))) || (((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return (::llvm::isa<::mlir::BFloat16Type>(elementType)); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && (((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 2)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 4)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 8))))) || (((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return (elementType.isSignlessInteger(8)); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && (((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 4)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 8)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 16))))) || (((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return ((::llvm::isa<::mlir::Float8E5M2FNUZType>(elementType))) || ((::llvm::isa<::mlir::Float8E4M3FNUZType>(elementType))); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 8)))) || (((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return ((::llvm::isa<::mlir::Float8E5M2Type>(elementType))) || ((::llvm::isa<::mlir::Float8E4M3FNType>(elementType))); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && (((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 8)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 32))))) || (((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return ((::llvm::isa<::mlir::Float6E2M3FNType>(elementType))) || ((::llvm::isa<::mlir::Float6E3M2FNType>(elementType))) || ((::llvm::isa<::mlir::Float4E2M1FNType>(elementType))); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 32)))))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be 32-bit float or 64-bit float or 32-bit signless integer or 64-bit signless integer or vector of 32-bit float values of length 2 or vector of 16-bit float values of length 4/8 or vector of bfloat16 type values of length 2/4/8 or vector of 8-bit signless integer values of length 4/8/16 or vector of f8E5M2FNUZ type or f8E4M3FNUZ type values of length 8 or vector of f8E5M2 type or f8E4M3FN type values of length 8/32 or vector of f6E2M3FN type or f6E3M2FN type or f4E2M1FN type values of length 32, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU9(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!(((type.isF64())) || (((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return (elementType.isF32()); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && (((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 4)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 16)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 32))))) || (((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return (elementType.isSignlessInteger(32)); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && (((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 4)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 16)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 32))))) || (((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return (elementType.isF64()); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 4)))))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be 64-bit float or vector of 32-bit float values of length 4/16/32 or vector of 32-bit signless integer values of length 4/16/32 or vector of 64-bit float values of length 4, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU10(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!(((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return ((elementType.isF32())) || ((elementType.isF16())) || ((::llvm::isa<::mlir::BFloat16Type>(elementType))); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && (((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 1)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 2)))))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be vector of 32-bit float or 16-bit float or bfloat16 type values of length 1/2, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU11(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!((type.isF32()))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be 32-bit float, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU12(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!(((((::llvm::isa<::mlir::FixedVectorType>(type))) && ([](::mlir::Type elementType) { return ((::llvm::isa<::mlir::Float8E5M2Type>(elementType))) || ((::llvm::isa<::mlir::Float8E4M3FNType>(elementType))); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && (((::llvm::isa<::mlir::FixedVectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 4)))) || ((((::llvm::isa<::mlir::FixedVectorType>(type))) && ([](::mlir::Type elementType) { return (::llvm::isa<::mlir::Float4E2M1FNType>(elementType)); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && (((::llvm::isa<::mlir::FixedVectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 8)))))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be fixed-length vector of f8E5M2 type or f8E4M3FN type values of length 4 or fixed-length vector of f4E2M1FN type values of length 8, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU13(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!((((::llvm::isa<::mlir::FixedVectorType>(type))) && ([](::mlir::Type elementType) { return ((::llvm::isa<::mlir::Float8E4M3FNUZType>(elementType))) || ((::llvm::isa<::mlir::Float8E5M2FNUZType>(elementType))) || ((::llvm::isa<::mlir::Float8E4M3FNType>(elementType))) || ((::llvm::isa<::mlir::Float8E5M2Type>(elementType))); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && (((::llvm::isa<::mlir::FixedVectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 4))))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be fixed-length vector of f8E4M3FNUZ type or f8E5M2FNUZ type or f8E4M3FN type or f8E5M2 type values of length 4, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU14(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!((type.isSignlessInteger(32)))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be variadic of 32-bit signless integer, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU15(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!(((type.isF32())) || (((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return ((elementType.isF16())) || ((::llvm::isa<::mlir::BFloat16Type>(elementType))); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 2)))))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be 32-bit float or vector of 16-bit float or bfloat16 type values of length 2, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU16(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!(((type.isF32())) || ((type.isF64())))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be 32-bit float or 64-bit float, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU17(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!((((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return ((::llvm::isa<::mlir::Float8E5M2Type>(elementType))) || ((::llvm::isa<::mlir::Float8E4M3FNType>(elementType))); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && (((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 1)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 2)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 3)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 4))))) || (((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return (::llvm::isa<::mlir::Float4E2M1FNType>(elementType)); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && (((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 1)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 2)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 3)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 4)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 5)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 6)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 7)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 8))))))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be vector of f8E5M2 type or f8E4M3FN type values of length 1/2/3/4 or vector of f4E2M1FN type values of length 1/2/3/4/5/6/7/8, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU18(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!(((((::llvm::isa<::mlir::FixedVectorType>(type))) && ([](::mlir::Type elementType) { return (elementType.isF32()); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && (((::llvm::isa<::mlir::FixedVectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 2)))) || ((((::llvm::isa<::mlir::FixedVectorType>(type))) && ([](::mlir::Type elementType) { return (elementType.isF16()); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && (((::llvm::isa<::mlir::FixedVectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 2)))) || ((((::llvm::isa<::mlir::FixedVectorType>(type))) && ([](::mlir::Type elementType) { return (::llvm::isa<::mlir::BFloat16Type>(elementType)); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && (((::llvm::isa<::mlir::FixedVectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 2)))))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be fixed-length vector of 32-bit float values of length 2 or fixed-length vector of 16-bit float values of length 2 or fixed-length vector of bfloat16 type values of length 2, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU19(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!((((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return ((::llvm::isa<::mlir::Float8E5M2Type>(elementType))) || ((::llvm::isa<::mlir::Float8E4M3FNType>(elementType))); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 32)))) || (((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return ((::llvm::isa<::mlir::Float6E2M3FNType>(elementType))) || ((::llvm::isa<::mlir::Float6E3M2FNType>(elementType))) || ((::llvm::isa<::mlir::Float4E2M1FNType>(elementType))); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 32)))))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be vector of f8E5M2 type or f8E4M3FN type values of length 32 or vector of f6E2M3FN type or f6E3M2FN type or f4E2M1FN type values of length 32, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU20(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!(((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return (elementType.isF32()); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && (((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 4)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 16)))))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be vector of 32-bit float values of length 4/16, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU21(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!(((::llvm::isa<::mlir::Float8E8M0FNUType>(type))) || ((((::llvm::isa<::mlir::FixedVectorType>(type))) && ([](::mlir::Type elementType) { return (::llvm::isa<::mlir::Float8E8M0FNUType>(elementType)); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && (((::llvm::isa<::mlir::FixedVectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 4)))))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be f8E8M0FNU type or fixed-length vector of f8E8M0FNU type values of length 4, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU22(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!((((type.isSignlessInteger())) || ((::llvm::isa<::mlir::FloatType>(type)))) || ((((::llvm::isa<::mlir::FixedVectorType>(type))) && ([](::mlir::Type elementType) { return ((elementType.isSignlessInteger())) || ((::llvm::isa<::mlir::FloatType>(elementType))); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ((::llvm::cast<::mlir::VectorType>(type).getRank()
                           == 1)))))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be Integer or Float or fixed-length vector of Integer or Float values of ranks 1, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU23(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return (true); }(::llvm::cast<::mlir::ShapedType>(type).getElementType())))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be vector of any type values, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU24(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!(((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return ((elementType.isF16())) || ((::llvm::isa<::mlir::BFloat16Type>(elementType))) || ((elementType.isSignlessInteger(8))) || ((elementType.isSignedInteger(8))) || ((elementType.isUnsignedInteger(8))) || ((elementType.isSignlessInteger(4))) || ((elementType.isSignedInteger(4))) || ((elementType.isUnsignedInteger(4))) || ((::llvm::isa<::mlir::Float8E4M3FNType>(elementType))) || ((::llvm::isa<::mlir::Float8E5M2Type>(elementType))); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && (((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 4)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 8)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 16)))))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be vector of 16-bit float or bfloat16 type or 8-bit signless integer or 8-bit signed integer or 8-bit unsigned integer or 4-bit signless integer or 4-bit signed integer or 4-bit unsigned integer or f8E4M3FN type or f8E5M2 type values of length 4/8/16, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMDGPU25(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!((((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return ((elementType.isF32())) || ((elementType.isSignlessInteger(32))); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && (((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 4)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 8))))) || (((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && ([](::mlir::Type elementType) { return ((elementType.isF16())) || ((::llvm::isa<::mlir::BFloat16Type>(elementType))); }(::llvm::cast<::mlir::ShapedType>(type).getElementType()))) && ((((::llvm::isa<::mlir::VectorType>(type))) && ((::llvm::cast<::mlir::VectorType>(type).getRank() > 0))) && (((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 4)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 8)) || ((::llvm::cast<::mlir::VectorType>(type).getNumElements()
                           == 16))))))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be vector of 32-bit float or 32-bit signless integer values of length 4/8 or vector of 16-bit float or bfloat16 type values of length 4/8/16, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU1(
    ::mlir::Attribute attr, ::llvm::StringRef attrName, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  if (attr && !((::llvm::isa<::mlir::amdgpu::DPPPermAttr>(attr))))
    return emitError() << "attribute '" << attrName
        << "' failed to satisfy constraint: The possible permutations for a DPP operation";
  return ::mlir::success();
}
static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU1(
    ::mlir::Operation *op, ::mlir::Attribute attr, ::llvm::StringRef attrName) {
  return __mlir_ods_local_attr_constraint_AMDGPU1(attr, attrName, [op]() {
    return op->emitOpError();
  });
}

static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU2(
    ::mlir::Attribute attr, ::llvm::StringRef attrName, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  if (attr && !((((::llvm::isa<::mlir::IntegerAttr>(attr))) && ((::llvm::cast<::mlir::IntegerAttr>(attr).getType().isSignlessInteger(32)))) || ((::llvm::isa<::mlir::ArrayAttr>(attr))) || ((::llvm::isa<::mlir::UnitAttr>(attr)))))
    return emitError() << "attribute '" << attrName
        << "' failed to satisfy constraint: 32-bit signless integer attribute or array attribute or unit attribute";
  return ::mlir::success();
}
static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU2(
    ::mlir::Operation *op, ::mlir::Attribute attr, ::llvm::StringRef attrName) {
  return __mlir_ods_local_attr_constraint_AMDGPU2(attr, attrName, [op]() {
    return op->emitOpError();
  });
}

static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU3(
    ::mlir::Attribute attr, ::llvm::StringRef attrName, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  if (attr && !(((::llvm::isa<::mlir::IntegerAttr>(attr))) && ((::llvm::cast<::mlir::IntegerAttr>(attr).getType().isSignlessInteger(32)))))
    return emitError() << "attribute '" << attrName
        << "' failed to satisfy constraint: 32-bit signless integer attribute";
  return ::mlir::success();
}
static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU3(
    ::mlir::Operation *op, ::mlir::Attribute attr, ::llvm::StringRef attrName) {
  return __mlir_ods_local_attr_constraint_AMDGPU3(attr, attrName, [op]() {
    return op->emitOpError();
  });
}

static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU4(
    ::mlir::Attribute attr, ::llvm::StringRef attrName, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  if (attr && !((::llvm::isa<::mlir::BoolAttr>(attr))))
    return emitError() << "attribute '" << attrName
        << "' failed to satisfy constraint: bool attribute";
  return ::mlir::success();
}
static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU4(
    ::mlir::Operation *op, ::mlir::Attribute attr, ::llvm::StringRef attrName) {
  return __mlir_ods_local_attr_constraint_AMDGPU4(attr, attrName, [op]() {
    return op->emitOpError();
  });
}

static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU5(
    ::mlir::Attribute attr, ::llvm::StringRef attrName, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  if (attr && !((((::llvm::isa<::mlir::IntegerAttr>(attr))) && ((::llvm::cast<::mlir::IntegerAttr>(attr).getType().isSignlessInteger(32)))) && ((!::llvm::cast<::mlir::IntegerAttr>(attr).getValue().isNegative())) && ((::llvm::cast<::mlir::IntegerAttr>(attr).getInt() <= 3))))
    return emitError() << "attribute '" << attrName
        << "' failed to satisfy constraint: 32-bit signless integer attribute whose value is non-negative whose maximum value is 3";
  return ::mlir::success();
}
static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU5(
    ::mlir::Operation *op, ::mlir::Attribute attr, ::llvm::StringRef attrName) {
  return __mlir_ods_local_attr_constraint_AMDGPU5(attr, attrName, [op]() {
    return op->emitOpError();
  });
}

static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU6(
    ::mlir::Attribute attr, ::llvm::StringRef attrName, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  if (attr && !(((::llvm::isa<::mlir::TypeAttr>(attr))) && ((::llvm::isa<::mlir::Type>(::llvm::cast<::mlir::TypeAttr>(attr).getValue()))) && ((true))))
    return emitError() << "attribute '" << attrName
        << "' failed to satisfy constraint: any type attribute";
  return ::mlir::success();
}
static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU6(
    ::mlir::Operation *op, ::mlir::Attribute attr, ::llvm::StringRef attrName) {
  return __mlir_ods_local_attr_constraint_AMDGPU6(attr, attrName, [op]() {
    return op->emitOpError();
  });
}

static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU7(
    ::mlir::Attribute attr, ::llvm::StringRef attrName, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  if (attr && !((::llvm::isa<::mlir::amdgpu::MFMAPermBAttr>(attr))))
    return emitError() << "attribute '" << attrName
        << "' failed to satisfy constraint: The possible permutations of the lanes storing B available in an MFMA";
  return ::mlir::success();
}
static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU7(
    ::mlir::Operation *op, ::mlir::Attribute attr, ::llvm::StringRef attrName) {
  return __mlir_ods_local_attr_constraint_AMDGPU7(attr, attrName, [op]() {
    return op->emitOpError();
  });
}

static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU8(
    ::mlir::Attribute attr, ::llvm::StringRef attrName, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  if (attr && !((::llvm::isa<::mlir::UnitAttr>(attr))))
    return emitError() << "attribute '" << attrName
        << "' failed to satisfy constraint: unit attribute";
  return ::mlir::success();
}
static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU8(
    ::mlir::Operation *op, ::mlir::Attribute attr, ::llvm::StringRef attrName) {
  return __mlir_ods_local_attr_constraint_AMDGPU8(attr, attrName, [op]() {
    return op->emitOpError();
  });
}

static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU9(
    ::mlir::Attribute attr, ::llvm::StringRef attrName, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  if (attr && !((((::llvm::isa<::mlir::IntegerAttr>(attr))) && ((::llvm::cast<::mlir::IntegerAttr>(attr).getType().isSignlessInteger(32)))) && ((!::llvm::cast<::mlir::IntegerAttr>(attr).getValue().isNegative())) && ((::llvm::cast<::mlir::IntegerAttr>(attr).getInt() <= 7))))
    return emitError() << "attribute '" << attrName
        << "' failed to satisfy constraint: 32-bit signless integer attribute whose value is non-negative whose maximum value is 7";
  return ::mlir::success();
}
static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU9(
    ::mlir::Operation *op, ::mlir::Attribute attr, ::llvm::StringRef attrName) {
  return __mlir_ods_local_attr_constraint_AMDGPU9(attr, attrName, [op]() {
    return op->emitOpError();
  });
}

static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU10(
    ::mlir::Attribute attr, ::llvm::StringRef attrName, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  if (attr && !((((::llvm::isa<::mlir::IntegerAttr>(attr))) && ((::llvm::cast<::mlir::IntegerAttr>(attr).getType().isSignlessInteger(32)))) && ((!::llvm::cast<::mlir::IntegerAttr>(attr).getValue().isNegative())) && ((::llvm::cast<::mlir::IntegerAttr>(attr).getInt() <= 1))))
    return emitError() << "attribute '" << attrName
        << "' failed to satisfy constraint: 32-bit signless integer attribute whose value is non-negative whose maximum value is 1";
  return ::mlir::success();
}
static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU10(
    ::mlir::Operation *op, ::mlir::Attribute attr, ::llvm::StringRef attrName) {
  return __mlir_ods_local_attr_constraint_AMDGPU10(attr, attrName, [op]() {
    return op->emitOpError();
  });
}

static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU11(
    ::mlir::Attribute attr, ::llvm::StringRef attrName, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  if (attr && !((::llvm::isa<::mlir::amdgpu::sched_barrier_opt_enumAttr>(attr))))
    return emitError() << "attribute '" << attrName
        << "' failed to satisfy constraint: The possible options for scheduling barriers";
  return ::mlir::success();
}
static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU11(
    ::mlir::Operation *op, ::mlir::Attribute attr, ::llvm::StringRef attrName) {
  return __mlir_ods_local_attr_constraint_AMDGPU11(attr, attrName, [op]() {
    return op->emitOpError();
  });
}

static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU12(
    ::mlir::Attribute attr, ::llvm::StringRef attrName, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  if (attr && !((((::llvm::isa<::mlir::IntegerAttr>(attr))) && ((::llvm::cast<::mlir::IntegerAttr>(attr).getType().isSignlessInteger(32)))) && ((::llvm::cast<::mlir::IntegerAttr>(attr).getInt() >= 0)) && ((::llvm::cast<::mlir::IntegerAttr>(attr).getInt() <= 1))))
    return emitError() << "attribute '" << attrName
        << "' failed to satisfy constraint: 32-bit signless integer attribute whose minimum value is 0 whose maximum value is 1";
  return ::mlir::success();
}
static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMDGPU12(
    ::mlir::Operation *op, ::mlir::Attribute attr, ::llvm::StringRef attrName) {
  return __mlir_ods_local_attr_constraint_AMDGPU12(attr, attrName, [op]() {
    return op->emitOpError();
  });
}
} // namespace amdgpu
} // namespace mlir
namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::DPPOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
DPPOpGenericAdaptorBase::DPPOpGenericAdaptorBase(DPPOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

::mlir::amdgpu::DPPPerm DPPOpGenericAdaptorBase::getKind() {
  auto attr = getKindAttr();
  return attr.getValue();
}

::std::optional<::mlir::Attribute> DPPOpGenericAdaptorBase::getPermArgument() {
  auto attr = getPermArgumentAttr();
  return attr ? ::std::optional<::mlir::Attribute>(attr) : (::std::nullopt);
}

::mlir::IntegerAttr DPPOpGenericAdaptorBase::getRowMaskAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::IntegerAttr>(getProperties().row_mask);
  return attr;
}

uint32_t DPPOpGenericAdaptorBase::getRowMask() {
  auto attr = getRowMaskAttr();
  return attr.getValue().getZExtValue();
}

::mlir::IntegerAttr DPPOpGenericAdaptorBase::getBankMaskAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::IntegerAttr>(getProperties().bank_mask);
  return attr;
}

uint32_t DPPOpGenericAdaptorBase::getBankMask() {
  auto attr = getBankMaskAttr();
  return attr.getValue().getZExtValue();
}

::mlir::BoolAttr DPPOpGenericAdaptorBase::getBoundCtrlAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::BoolAttr>(getProperties().bound_ctrl);
  return attr;
}

bool DPPOpGenericAdaptorBase::getBoundCtrl() {
  auto attr = getBoundCtrlAttr();
  return attr.getValue();
}

} // namespace detail
DPPOpAdaptor::DPPOpAdaptor(DPPOp op) : DPPOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult DPPOpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_bank_mask = getProperties().bank_mask; (void)tblgen_bank_mask;
  auto tblgen_bound_ctrl = getProperties().bound_ctrl; (void)tblgen_bound_ctrl;
  auto tblgen_kind = getProperties().kind; (void)tblgen_kind;
  if (!tblgen_kind) return emitError(loc, "'amdgpu.dpp' op ""requires attribute 'kind'");
  auto tblgen_permArgument = getProperties().permArgument; (void)tblgen_permArgument;
  auto tblgen_row_mask = getProperties().row_mask; (void)tblgen_row_mask;

  if (tblgen_kind && !((::llvm::isa<::mlir::amdgpu::DPPPermAttr>(tblgen_kind))))
    return emitError(loc, "'amdgpu.dpp' op ""attribute 'kind' failed to satisfy constraint: The possible permutations for a DPP operation");

  if (tblgen_permArgument && !((((::llvm::isa<::mlir::IntegerAttr>(tblgen_permArgument))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_permArgument).getType().isSignlessInteger(32)))) || ((::llvm::isa<::mlir::ArrayAttr>(tblgen_permArgument))) || ((::llvm::isa<::mlir::UnitAttr>(tblgen_permArgument)))))
    return emitError(loc, "'amdgpu.dpp' op ""attribute 'permArgument' failed to satisfy constraint: 32-bit signless integer attribute or array attribute or unit attribute");

  if (tblgen_row_mask && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_row_mask))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_row_mask).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.dpp' op ""attribute 'row_mask' failed to satisfy constraint: 32-bit signless integer attribute");

  if (tblgen_bank_mask && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_bank_mask))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_bank_mask).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.dpp' op ""attribute 'bank_mask' failed to satisfy constraint: 32-bit signless integer attribute");

  if (tblgen_bound_ctrl && !((::llvm::isa<::mlir::BoolAttr>(tblgen_bound_ctrl))))
    return emitError(loc, "'amdgpu.dpp' op ""attribute 'bound_ctrl' failed to satisfy constraint: bool attribute");
  return ::mlir::success();
}

::llvm::LogicalResult DPPOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.bank_mask;
       auto attr = dict.get("bank_mask");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `bank_mask` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.bound_ctrl;
       auto attr = dict.get("bound_ctrl");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `bound_ctrl` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.kind;
       auto attr = dict.get("kind");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `kind` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.permArgument;
       auto attr = dict.get("permArgument");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `permArgument` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.row_mask;
       auto attr = dict.get("row_mask");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `row_mask` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
  return ::mlir::success();
}

::mlir::Attribute DPPOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.bank_mask;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("bank_mask",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.bound_ctrl;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("bound_ctrl",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.kind;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("kind",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.permArgument;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("permArgument",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.row_mask;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("row_mask",
                                       propStorage));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code DPPOp::computePropertiesHash(const Properties &prop) {
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.bank_mask.getAsOpaquePointer()), 
    llvm::hash_value(prop.bound_ctrl.getAsOpaquePointer()), 
    llvm::hash_value(prop.kind.getAsOpaquePointer()), 
    llvm::hash_value(prop.permArgument.getAsOpaquePointer()), 
    llvm::hash_value(prop.row_mask.getAsOpaquePointer()));
}

std::optional<mlir::Attribute> DPPOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "bank_mask")
      return prop.bank_mask;

    if (name == "bound_ctrl")
      return prop.bound_ctrl;

    if (name == "kind")
      return prop.kind;

    if (name == "permArgument")
      return prop.permArgument;

    if (name == "row_mask")
      return prop.row_mask;
  return std::nullopt;
}

void DPPOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "bank_mask") {
       prop.bank_mask = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.bank_mask)>>(value);
       return;
    }

    if (name == "bound_ctrl") {
       prop.bound_ctrl = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.bound_ctrl)>>(value);
       return;
    }

    if (name == "kind") {
       prop.kind = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.kind)>>(value);
       return;
    }

    if (name == "permArgument") {
       prop.permArgument = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.permArgument)>>(value);
       return;
    }

    if (name == "row_mask") {
       prop.row_mask = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.row_mask)>>(value);
       return;
    }
}

void DPPOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.bank_mask) attrs.append("bank_mask", prop.bank_mask);

    if (prop.bound_ctrl) attrs.append("bound_ctrl", prop.bound_ctrl);

    if (prop.kind) attrs.append("kind", prop.kind);

    if (prop.permArgument) attrs.append("permArgument", prop.permArgument);

    if (prop.row_mask) attrs.append("row_mask", prop.row_mask);
}

::llvm::LogicalResult DPPOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getBankMaskAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "bank_mask", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getBoundCtrlAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU4(attr, "bound_ctrl", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getKindAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU1(attr, "kind", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getPermArgumentAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU2(attr, "permArgument", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getRowMaskAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "row_mask", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult DPPOp::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readOptionalAttribute(prop.bank_mask)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.bound_ctrl)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readAttribute(prop.kind)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.permArgument)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.row_mask)))
    return ::mlir::failure();
  return ::mlir::success();
}

void DPPOp::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;

  writer.writeOptionalAttribute(prop.bank_mask);

  writer.writeOptionalAttribute(prop.bound_ctrl);
  writer.writeAttribute(prop.kind);

  writer.writeOptionalAttribute(prop.permArgument);

  writer.writeOptionalAttribute(prop.row_mask);
}

::mlir::amdgpu::DPPPerm DPPOp::getKind() {
  auto attr = getKindAttr();
  return attr.getValue();
}

::std::optional<::mlir::Attribute> DPPOp::getPermArgument() {
  auto attr = getPermArgumentAttr();
  return attr ? ::std::optional<::mlir::Attribute>(attr) : (::std::nullopt);
}

uint32_t DPPOp::getRowMask() {
  auto attr = getRowMaskAttr();
  return attr.getValue().getZExtValue();
}

uint32_t DPPOp::getBankMask() {
  auto attr = getBankMaskAttr();
  return attr.getValue().getZExtValue();
}

bool DPPOp::getBoundCtrl() {
  auto attr = getBoundCtrlAttr();
  return attr.getValue();
}

void DPPOp::setKind(::mlir::amdgpu::DPPPerm attrValue) {
  getProperties().kind = ::mlir::amdgpu::DPPPermAttr::get(::mlir::Builder((*this)->getContext()).getContext(), attrValue);
}

void DPPOp::setRowMask(uint32_t attrValue) {
  getProperties().row_mask = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void DPPOp::setBankMask(uint32_t attrValue) {
  getProperties().bank_mask = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void DPPOp::setBoundCtrl(bool attrValue) {
  getProperties().bound_ctrl = ::mlir::Builder((*this)->getContext()).getBoolAttr(attrValue);
}

void DPPOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type result, ::mlir::Value old, ::mlir::Value src, ::mlir::amdgpu::DPPPermAttr kind, /*optional*/::mlir::Attribute permArgument, ::mlir::IntegerAttr row_mask, ::mlir::IntegerAttr bank_mask, ::mlir::BoolAttr bound_ctrl) {
  odsState.addOperands(old);
  odsState.addOperands(src);
  odsState.getOrAddProperties<Properties>().kind = kind;
  if (permArgument) {
    odsState.getOrAddProperties<Properties>().permArgument = permArgument;
  }
  if (row_mask) {
    odsState.getOrAddProperties<Properties>().row_mask = row_mask;
  }
  if (bank_mask) {
    odsState.getOrAddProperties<Properties>().bank_mask = bank_mask;
  }
  if (bound_ctrl) {
    odsState.getOrAddProperties<Properties>().bound_ctrl = bound_ctrl;
  }
  odsState.addTypes(result);
}

void DPPOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value old, ::mlir::Value src, ::mlir::amdgpu::DPPPermAttr kind, /*optional*/::mlir::Attribute permArgument, ::mlir::IntegerAttr row_mask, ::mlir::IntegerAttr bank_mask, ::mlir::BoolAttr bound_ctrl) {
  odsState.addOperands(old);
  odsState.addOperands(src);
  odsState.getOrAddProperties<Properties>().kind = kind;
  if (permArgument) {
    odsState.getOrAddProperties<Properties>().permArgument = permArgument;
  }
  if (row_mask) {
    odsState.getOrAddProperties<Properties>().row_mask = row_mask;
  }
  if (bank_mask) {
    odsState.getOrAddProperties<Properties>().bank_mask = bank_mask;
  }
  if (bound_ctrl) {
    odsState.getOrAddProperties<Properties>().bound_ctrl = bound_ctrl;
  }

        ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
        if (::mlir::succeeded(DPPOp::inferReturnTypes(odsBuilder.getContext(),
                      odsState.location, odsState.operands,
                      odsState.attributes.getDictionary(odsState.getContext()),
                      odsState.getRawProperties(),
                      odsState.regions, inferredReturnTypes)))
          odsState.addTypes(inferredReturnTypes);
        else
          ::mlir::detail::reportFatalInferReturnTypesError(odsState);
        
}

void DPPOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value old, ::mlir::Value src, ::mlir::amdgpu::DPPPermAttr kind, /*optional*/::mlir::Attribute permArgument, ::mlir::IntegerAttr row_mask, ::mlir::IntegerAttr bank_mask, ::mlir::BoolAttr bound_ctrl) {
  odsState.addOperands(old);
  odsState.addOperands(src);
  odsState.getOrAddProperties<Properties>().kind = kind;
  if (permArgument) {
    odsState.getOrAddProperties<Properties>().permArgument = permArgument;
  }
  if (row_mask) {
    odsState.getOrAddProperties<Properties>().row_mask = row_mask;
  }
  if (bank_mask) {
    odsState.getOrAddProperties<Properties>().bank_mask = bank_mask;
  }
  if (bound_ctrl) {
    odsState.getOrAddProperties<Properties>().bound_ctrl = bound_ctrl;
  }
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void DPPOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type result, ::mlir::Value old, ::mlir::Value src, ::mlir::amdgpu::DPPPerm kind, /*optional*/::mlir::Attribute permArgument, uint32_t row_mask, uint32_t bank_mask, bool bound_ctrl) {
  odsState.addOperands(old);
  odsState.addOperands(src);
  odsState.getOrAddProperties<Properties>().kind = ::mlir::amdgpu::DPPPermAttr::get(odsBuilder.getContext(), kind);
  if (permArgument) {
    odsState.getOrAddProperties<Properties>().permArgument = permArgument;
  }
  odsState.getOrAddProperties<Properties>().row_mask = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), row_mask);
  odsState.getOrAddProperties<Properties>().bank_mask = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), bank_mask);
  odsState.getOrAddProperties<Properties>().bound_ctrl = odsBuilder.getBoolAttr(bound_ctrl);
  odsState.addTypes(result);
}

void DPPOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value old, ::mlir::Value src, ::mlir::amdgpu::DPPPerm kind, /*optional*/::mlir::Attribute permArgument, uint32_t row_mask, uint32_t bank_mask, bool bound_ctrl) {
  odsState.addOperands(old);
  odsState.addOperands(src);
  odsState.getOrAddProperties<Properties>().kind = ::mlir::amdgpu::DPPPermAttr::get(odsBuilder.getContext(), kind);
  if (permArgument) {
    odsState.getOrAddProperties<Properties>().permArgument = permArgument;
  }
  odsState.getOrAddProperties<Properties>().row_mask = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), row_mask);
  odsState.getOrAddProperties<Properties>().bank_mask = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), bank_mask);
  odsState.getOrAddProperties<Properties>().bound_ctrl = odsBuilder.getBoolAttr(bound_ctrl);

        ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
        if (::mlir::succeeded(DPPOp::inferReturnTypes(odsBuilder.getContext(),
                      odsState.location, odsState.operands,
                      odsState.attributes.getDictionary(odsState.getContext()),
                      odsState.getRawProperties(),
                      odsState.regions, inferredReturnTypes)))
          odsState.addTypes(inferredReturnTypes);
        else
          ::mlir::detail::reportFatalInferReturnTypesError(odsState);
        
}

void DPPOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value old, ::mlir::Value src, ::mlir::amdgpu::DPPPerm kind, /*optional*/::mlir::Attribute permArgument, uint32_t row_mask, uint32_t bank_mask, bool bound_ctrl) {
  odsState.addOperands(old);
  odsState.addOperands(src);
  odsState.getOrAddProperties<Properties>().kind = ::mlir::amdgpu::DPPPermAttr::get(odsBuilder.getContext(), kind);
  if (permArgument) {
    odsState.getOrAddProperties<Properties>().permArgument = permArgument;
  }
  odsState.getOrAddProperties<Properties>().row_mask = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), row_mask);
  odsState.getOrAddProperties<Properties>().bank_mask = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), bank_mask);
  odsState.getOrAddProperties<Properties>().bound_ctrl = odsBuilder.getBoolAttr(bound_ctrl);
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void DPPOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() == 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<DPPOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void DPPOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() == 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<DPPOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
  ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
  if (::mlir::succeeded(DPPOp::inferReturnTypes(odsBuilder.getContext(),
          odsState.location, operands,
          odsState.attributes.getDictionary(odsState.getContext()),
          odsState.getRawProperties(),
          odsState.regions, inferredReturnTypes))) {
    assert(inferredReturnTypes.size() == 1u && "mismatched number of return types");
    odsState.addTypes(inferredReturnTypes);
  } else {
    ::llvm::report_fatal_error("Failed to infer result type(s).");
  }
}

void DPPOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() == 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void DPPOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() == 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties &>(properties));
  odsState.addAttributes(discardableAttributes);

  ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
  if (::mlir::succeeded(DPPOp::inferReturnTypes(odsBuilder.getContext(),
          odsState.location, operands,
          odsState.attributes.getDictionary(odsState.getContext()),
          odsState.getRawProperties(),
          odsState.regions, inferredReturnTypes))) {
    assert(inferredReturnTypes.size() == 1u && "mismatched number of return types");
    odsState.addTypes(inferredReturnTypes);
  } else {
    ::llvm::report_fatal_error("Failed to infer result type(s).");
  }
}

void DPPOp::populateDefaultProperties(::mlir::OperationName opName, Properties &properties) {
  ::mlir::Builder odsBuilder(opName.getContext());
  if (!properties.row_mask)
    properties.row_mask = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), 0xf);
  if (!properties.bank_mask)
    properties.bank_mask = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), 0xf);
  if (!properties.bound_ctrl)
    properties.bound_ctrl = odsBuilder.getBoolAttr(false);
}

::llvm::LogicalResult DPPOp::verifyInvariantsImpl() {
  auto tblgen_bank_mask = getProperties().bank_mask; (void)tblgen_bank_mask;
  auto tblgen_bound_ctrl = getProperties().bound_ctrl; (void)tblgen_bound_ctrl;
  auto tblgen_kind = getProperties().kind; (void)tblgen_kind;
  if (!tblgen_kind) return emitOpError("requires attribute 'kind'");
  auto tblgen_permArgument = getProperties().permArgument; (void)tblgen_permArgument;
  auto tblgen_row_mask = getProperties().row_mask; (void)tblgen_row_mask;

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU1(*this, tblgen_kind, "kind")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU2(*this, tblgen_permArgument, "permArgument")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_row_mask, "row_mask")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_bank_mask, "bank_mask")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU4(*this, tblgen_bound_ctrl, "bound_ctrl")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU1(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU1(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSResults(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU1(*this, v.getType(), "result", index++)))
        return ::mlir::failure();
    }
  }
  if (!((((*this->getODSResults(0).begin()).getType()) == ((*this->getODSOperands(0).begin()).getType()) && ((*this->getODSOperands(0).begin()).getType()) == ((*this->getODSOperands(1).begin()).getType()) && ((*this->getODSOperands(1).begin()).getType()) == ((*this->getODSResults(0).begin()).getType()))))
    return emitOpError("failed to verify that all of {result, old, src} have same type");
  return ::mlir::success();
}

::llvm::LogicalResult DPPOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::llvm::LogicalResult DPPOp::inferReturnTypes(::mlir::MLIRContext *context, ::std::optional<::mlir::Location> location, ::mlir::ValueRange operands, ::mlir::DictionaryAttr attributes, ::mlir::OpaqueProperties properties, ::mlir::RegionRange regions, ::llvm::SmallVectorImpl<::mlir::Type>&inferredReturnTypes) {
  inferredReturnTypes.resize(1);
  ::mlir::Builder odsBuilder(context);
  if (operands.size() <= 1)
    return ::mlir::failure();
  ::mlir::Type odsInferredType0 = operands[1].getType();
  inferredReturnTypes[0] = odsInferredType0;
  return ::mlir::success();
}

::mlir::ParseResult DPPOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand oldRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> oldOperands(&oldRawOperand, 1);  ::llvm::SMLoc oldOperandsLoc;
  (void)oldOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand srcRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> srcOperands(&srcRawOperand, 1);  ::llvm::SMLoc srcOperandsLoc;
  (void)srcOperandsLoc;
  ::mlir::amdgpu::DPPPermAttr kindAttr;
  ::mlir::Attribute permArgumentAttr;
  ::mlir::Type resultRawType{};
  ::llvm::ArrayRef<::mlir::Type> resultTypes(&resultRawType, 1);

  oldOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(oldRawOperand))
    return ::mlir::failure();

  srcOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(srcRawOperand))
    return ::mlir::failure();

  if (parser.parseCustomAttributeWithFallback(kindAttr, ::mlir::Type{})) {
    return ::mlir::failure();
  }
  if (kindAttr) result.getOrAddProperties<DPPOp::Properties>().kind = kindAttr;
  if (::mlir::succeeded(parser.parseOptionalLParen())) {

  if (parser.parseAttribute(permArgumentAttr, ::mlir::Type{}))
    return ::mlir::failure();
  if (permArgumentAttr) result.getOrAddProperties<DPPOp::Properties>().permArgument = permArgumentAttr;
  if (parser.parseRParen())
    return ::mlir::failure();
  }
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }
  if (parser.parseColon())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    resultRawType = type;
  }
  result.addTypes(resultTypes);
  if (parser.resolveOperands(oldOperands, resultTypes[0], oldOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(srcOperands, resultTypes[0], srcOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void DPPOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  _odsPrinter << ' ';
  _odsPrinter << getOld();
  _odsPrinter << ' ';
  _odsPrinter << getSrc();
  _odsPrinter << ' ';
_odsPrinter.printStrippedAttrOrType(getKindAttr());
  if (getPermArgumentAttr()) {
    _odsPrinter << "(";
    _odsPrinter.printAttribute(getPermArgumentAttr());
    _odsPrinter << ")";
  }
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("kind");
  elidedAttrs.push_back("permArgument");
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getRowMaskAttr();
     if(attr && (attr == odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), 0xf)))
       elidedAttrs.push_back("row_mask");
  }
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getBankMaskAttr();
     if(attr && (attr == odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), 0xf)))
       elidedAttrs.push_back("bank_mask");
  }
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getBoundCtrlAttr();
     if(attr && (attr == odsBuilder.getBoolAttr(false)))
       elidedAttrs.push_back("bound_ctrl");
  }
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getResult().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
}

void DPPOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::DPPOp)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::ExtPackedFp8Op definitions
//===----------------------------------------------------------------------===//

namespace detail {
ExtPackedFp8OpGenericAdaptorBase::ExtPackedFp8OpGenericAdaptorBase(ExtPackedFp8Op op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

uint32_t ExtPackedFp8OpGenericAdaptorBase::getIndex() {
  auto attr = getIndexAttr();
  return attr.getValue().getZExtValue();
}

} // namespace detail
ExtPackedFp8OpAdaptor::ExtPackedFp8OpAdaptor(ExtPackedFp8Op op) : ExtPackedFp8OpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult ExtPackedFp8OpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_index = getProperties().index; (void)tblgen_index;
  if (!tblgen_index) return emitError(loc, "'amdgpu.ext_packed_fp8' op ""requires attribute 'index'");

  if (tblgen_index && !((((::llvm::isa<::mlir::IntegerAttr>(tblgen_index))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_index).getType().isSignlessInteger(32)))) && ((!::llvm::cast<::mlir::IntegerAttr>(tblgen_index).getValue().isNegative())) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_index).getInt() <= 3))))
    return emitError(loc, "'amdgpu.ext_packed_fp8' op ""attribute 'index' failed to satisfy constraint: 32-bit signless integer attribute whose value is non-negative whose maximum value is 3");
  return ::mlir::success();
}

::llvm::LogicalResult ExtPackedFp8Op::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.index;
       auto attr = dict.get("index");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `index` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
  return ::mlir::success();
}

::mlir::Attribute ExtPackedFp8Op::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.index;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("index",
                                       propStorage));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code ExtPackedFp8Op::computePropertiesHash(const Properties &prop) {
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.index.getAsOpaquePointer()));
}

std::optional<mlir::Attribute> ExtPackedFp8Op::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "index")
      return prop.index;
  return std::nullopt;
}

void ExtPackedFp8Op::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "index") {
       prop.index = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.index)>>(value);
       return;
    }
}

void ExtPackedFp8Op::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.index) attrs.append("index", prop.index);
}

::llvm::LogicalResult ExtPackedFp8Op::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getIndexAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU5(attr, "index", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult ExtPackedFp8Op::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readAttribute(prop.index)))
    return ::mlir::failure();
  return ::mlir::success();
}

void ExtPackedFp8Op::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;
  writer.writeAttribute(prop.index);
}

uint32_t ExtPackedFp8Op::getIndex() {
  auto attr = getIndexAttr();
  return attr.getValue().getZExtValue();
}

void ExtPackedFp8Op::setIndex(uint32_t attrValue) {
  getProperties().index = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void ExtPackedFp8Op::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type res, ::mlir::Value source, ::mlir::IntegerAttr index) {
  odsState.addOperands(source);
  odsState.getOrAddProperties<Properties>().index = index;
  odsState.addTypes(res);
}

void ExtPackedFp8Op::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value source, ::mlir::IntegerAttr index) {
  odsState.addOperands(source);
  odsState.getOrAddProperties<Properties>().index = index;
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void ExtPackedFp8Op::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type res, ::mlir::Value source, uint32_t index) {
  odsState.addOperands(source);
  odsState.getOrAddProperties<Properties>().index = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), index);
  odsState.addTypes(res);
}

void ExtPackedFp8Op::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value source, uint32_t index) {
  odsState.addOperands(source);
  odsState.getOrAddProperties<Properties>().index = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), index);
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void ExtPackedFp8Op::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() == 1u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<ExtPackedFp8Op::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void ExtPackedFp8Op::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() == 1u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

::llvm::LogicalResult ExtPackedFp8Op::verifyInvariantsImpl() {
  auto tblgen_index = getProperties().index; (void)tblgen_index;
  if (!tblgen_index) return emitOpError("requires attribute 'index'");

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU5(*this, tblgen_index, "index")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU2(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSResults(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU3(*this, v.getType(), "result", index++)))
        return ::mlir::failure();
    }
  }
  return ::mlir::success();
}

::llvm::LogicalResult ExtPackedFp8Op::verifyInvariants() {
  return verifyInvariantsImpl();
}

::mlir::ParseResult ExtPackedFp8Op::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand sourceRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> sourceOperands(&sourceRawOperand, 1);  ::llvm::SMLoc sourceOperandsLoc;
  (void)sourceOperandsLoc;
  ::mlir::IntegerAttr indexAttr;
  ::mlir::Type sourceRawType{};
  ::llvm::ArrayRef<::mlir::Type> sourceTypes(&sourceRawType, 1);
  ::mlir::Type resRawType{};
  ::llvm::ArrayRef<::mlir::Type> resTypes(&resRawType, 1);
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }

  sourceOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(sourceRawOperand))
    return ::mlir::failure();
  if (parser.parseLSquare())
    return ::mlir::failure();

  if (parser.parseCustomAttributeWithFallback(indexAttr, parser.getBuilder().getIntegerType(32))) {
    return ::mlir::failure();
  }
  if (indexAttr) result.getOrAddProperties<ExtPackedFp8Op::Properties>().index = indexAttr;
  if (parser.parseRSquare())
    return ::mlir::failure();
  if (parser.parseColon())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    sourceRawType = type;
  }
  if (parser.parseKeyword("to"))
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    resRawType = type;
  }
  result.addTypes(resTypes);
  if (parser.resolveOperands(sourceOperands, sourceTypes, sourceOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void ExtPackedFp8Op::print(::mlir::OpAsmPrinter &_odsPrinter) {
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("index");
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ';
  _odsPrinter << getSource();
  _odsPrinter << "[";
  _odsPrinter.printAttributeWithoutType(getIndexAttr());
  _odsPrinter << "]";
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getSource().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ' ' << "to";
  _odsPrinter << ' ';
  {
    auto type = getRes().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
}

void ExtPackedFp8Op::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::ExtPackedFp8Op)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::FatRawBufferCastOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
FatRawBufferCastOpGenericAdaptorBase::FatRawBufferCastOpGenericAdaptorBase(FatRawBufferCastOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

std::pair<unsigned, unsigned> FatRawBufferCastOpGenericAdaptorBase::getODSOperandIndexAndLength(unsigned index, unsigned odsOperandsSize) {
  ::llvm::ArrayRef<int32_t> sizeAttr = getProperties().operandSegmentSizes;

  unsigned start = 0;
  for (unsigned i = 0; i < index; ++i)
    start += sizeAttr[i];
  return {start, sizeAttr[index]};
}

} // namespace detail
FatRawBufferCastOpAdaptor::FatRawBufferCastOpAdaptor(FatRawBufferCastOp op) : FatRawBufferCastOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult FatRawBufferCastOpAdaptor::verify(::mlir::Location loc) {
  return ::mlir::success();
}

std::pair<unsigned, unsigned> FatRawBufferCastOp::getODSOperandIndexAndLength(unsigned index) {
  ::llvm::ArrayRef<int32_t> sizeAttr = getProperties().operandSegmentSizes;

  unsigned start = 0;
  for (unsigned i = 0; i < index; ++i)
    start += sizeAttr[i];
  return {start, sizeAttr[index]};
}

::mlir::MutableOperandRange FatRawBufferCastOp::getValidBytesMutable() {
  auto range = getODSOperandIndexAndLength(1);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second, ::mlir::MutableOperandRange::OperandSegment(1u, {getOperandSegmentSizesAttrName(), ::mlir::DenseI32ArrayAttr::get(getContext(), getProperties().operandSegmentSizes)}));
  return mutableRange;
}

::mlir::MutableOperandRange FatRawBufferCastOp::getCacheSwizzleStrideMutable() {
  auto range = getODSOperandIndexAndLength(2);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second, ::mlir::MutableOperandRange::OperandSegment(2u, {getOperandSegmentSizesAttrName(), ::mlir::DenseI32ArrayAttr::get(getContext(), getProperties().operandSegmentSizes)}));
  return mutableRange;
}

::llvm::LogicalResult FatRawBufferCastOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }
    {

      auto setFromAttr = [] (auto &propStorage, ::mlir::Attribute propAttr,
               ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) -> ::mlir::LogicalResult {
        return convertFromAttribute(propStorage, propAttr, emitError);
      };
         auto attr = dict.get("boundsCheck");;
;
      if (attr) {
        if (::mlir::failed(setFromAttr(prop.boundsCheck, attr, emitError)))
          return ::mlir::failure();
      } else {
        prop.boundsCheck = true;
      }
  }
{

      auto setFromAttr = [] (auto &propStorage, ::mlir::Attribute propAttr,
               ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) -> ::mlir::LogicalResult {
        if (::llvm::isa<::mlir::UnitAttr>(propAttr)) {
      propStorage = true;
      return ::mlir::success();
    }
    if (auto boolAttr = ::llvm::dyn_cast<::mlir::BoolAttr>(propAttr)) {
      propStorage = boolAttr.getValue();
      return ::mlir::success();
    }
    return ::mlir::failure();
      };
         auto attr = dict.get("resetOffset");;
;
      if (attr) {
        if (::mlir::failed(setFromAttr(prop.resetOffset, attr, emitError)))
          return ::mlir::failure();
      } else {
        prop.resetOffset = false;
      }
  }
{

      auto setFromAttr = [] (auto &propStorage, ::mlir::Attribute propAttr,
               ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) -> ::mlir::LogicalResult {
        return convertFromAttribute(propStorage, propAttr, emitError);
      };
         auto attr = dict.get("operandSegmentSizes");   if (!attr) attr = dict.get("operand_segment_sizes");;
;
      if (attr && ::mlir::failed(setFromAttr(prop.operandSegmentSizes, attr, emitError)))
        return ::mlir::failure();
  }
  return ::mlir::success();
}

::mlir::Attribute FatRawBufferCastOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.boundsCheck;
      auto attr = [&]() -> ::mlir::Attribute {
        return convertToAttribute(ctx, propStorage);
      }();
      attrs.push_back(odsBuilder.getNamedAttr("boundsCheck", attr));
    }

    {
      const auto &propStorage = prop.resetOffset;
      auto attr = [&]() -> ::mlir::Attribute {
        if (propStorage)
      return ::mlir::UnitAttr::get(ctx);
    else
      return ::mlir::BoolAttr::get(ctx, false);
      }();
      attrs.push_back(odsBuilder.getNamedAttr("resetOffset", attr));
    }

    {
      const auto &propStorage = prop.operandSegmentSizes;
      auto attr = [&]() -> ::mlir::Attribute {
        return ::mlir::DenseI32ArrayAttr::get(ctx, propStorage);
      }();
      attrs.push_back(odsBuilder.getNamedAttr("operandSegmentSizes", attr));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code FatRawBufferCastOp::computePropertiesHash(const Properties &prop) {
  auto hash_operandSegmentSizes = [] (const auto &propStorage) -> llvm::hash_code {
    using ::llvm::hash_value;
    return ::llvm::hash_combine_range(std::begin(propStorage), std::end(propStorage));;
  };
  using llvm::hash_value;
  return llvm::hash_combine(
    hash_value(prop.boundsCheck), 
    hash_value(prop.resetOffset), 
    hash_operandSegmentSizes(prop.operandSegmentSizes));
}

std::optional<mlir::Attribute> FatRawBufferCastOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "operand_segment_sizes" || name == "operandSegmentSizes") return [&]() -> ::mlir::Attribute { return ::mlir::DenseI32ArrayAttr::get(ctx, prop.operandSegmentSizes); }();
  return std::nullopt;
}

void FatRawBufferCastOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
        if (name == "operand_segment_sizes" || name == "operandSegmentSizes") {
       auto arrAttr = ::llvm::dyn_cast_or_null<::mlir::DenseI32ArrayAttr>(value);
       if (!arrAttr) return;
       if (arrAttr.size() != sizeof(prop.operandSegmentSizes) / sizeof(int32_t))
         return;
       llvm::copy(arrAttr.asArrayRef(), prop.operandSegmentSizes.begin());
       return;
    }
}

void FatRawBufferCastOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
  attrs.append("operandSegmentSizes", [&]() -> ::mlir::Attribute { return ::mlir::DenseI32ArrayAttr::get(ctx, prop.operandSegmentSizes); }());
}

::llvm::LogicalResult FatRawBufferCastOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    return ::mlir::success();
}

::llvm::LogicalResult FatRawBufferCastOp::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (reader.getBytecodeVersion() < /*kNativePropertiesODSSegmentSize=*/6) {
    auto &propStorage = prop.operandSegmentSizes;
    ::mlir::DenseI32ArrayAttr attr;
    if (::mlir::failed(reader.readAttribute(attr))) return ::mlir::failure();
    if (attr.size() > static_cast<int64_t>(sizeof(propStorage) / sizeof(int32_t))) {
      reader.emitError("size mismatch for operand/result_segment_size");
      return ::mlir::failure();
    }
    ::llvm::copy(::llvm::ArrayRef<int32_t>(attr), propStorage.begin());
  }

  {
    auto &propStorage = prop.boundsCheck;
    auto readProp = [&]() {
      return reader.readBool(propStorage);;
      return ::mlir::success();
    };
    if (::mlir::failed(readProp()))
      return ::mlir::failure();
  }

  {
    auto &propStorage = prop.resetOffset;
    auto readProp = [&]() {
      if (::mlir::failed(reader.readBool(propStorage)))
      return ::mlir::failure();;
      return ::mlir::success();
    };
    if (::mlir::failed(readProp()))
      return ::mlir::failure();
  }

  {
    auto &propStorage = prop.operandSegmentSizes;
    auto readProp = [&]() {

  if (reader.getBytecodeVersion() >= /*kNativePropertiesODSSegmentSize=*/6)
    return reader.readSparseArray(::llvm::MutableArrayRef(propStorage));
;
      return ::mlir::success();
    };
    if (::mlir::failed(readProp()))
      return ::mlir::failure();
  }
  return ::mlir::success();
}

void FatRawBufferCastOp::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;

if (writer.getBytecodeVersion() < /*kNativePropertiesODSSegmentSize=*/6) {
  auto &propStorage = prop.operandSegmentSizes;
  writer.writeAttribute(::mlir::DenseI32ArrayAttr::get(this->getContext(), propStorage));
}

  {
    auto &propStorage = prop.boundsCheck;
    writer.writeOwnedBool(propStorage);;
  }

  {
    auto &propStorage = prop.resetOffset;
    writer.writeOwnedBool(propStorage);;
  }

  {
    auto &propStorage = prop.operandSegmentSizes;

  if (writer.getBytecodeVersion() >= /*kNativePropertiesODSSegmentSize=*/6)
    writer.writeSparseArray(::llvm::ArrayRef(propStorage));
;
  }
}

void FatRawBufferCastOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type result, ::mlir::Value source, /*optional*/::mlir::Value validBytes, /*optional*/::mlir::Value cacheSwizzleStride, /*optional*/bool boundsCheck, /*optional*/bool resetOffset) {
  odsState.addOperands(source);
  if (validBytes)
    odsState.addOperands(validBytes);
  if (cacheSwizzleStride)
    odsState.addOperands(cacheSwizzleStride);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, (validBytes ? 1 : 0), (cacheSwizzleStride ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().setBoundsCheck(boundsCheck);
  odsState.getOrAddProperties<Properties>().setResetOffset(resetOffset);
  odsState.addTypes(result);
}

void FatRawBufferCastOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value source, /*optional*/::mlir::Value validBytes, /*optional*/::mlir::Value cacheSwizzleStride, /*optional*/bool boundsCheck, /*optional*/bool resetOffset) {
  odsState.addOperands(source);
  if (validBytes)
    odsState.addOperands(validBytes);
  if (cacheSwizzleStride)
    odsState.addOperands(cacheSwizzleStride);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, (validBytes ? 1 : 0), (cacheSwizzleStride ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().setBoundsCheck(boundsCheck);
  odsState.getOrAddProperties<Properties>().setResetOffset(resetOffset);

        ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
        if (::mlir::succeeded(FatRawBufferCastOp::inferReturnTypes(odsBuilder.getContext(),
                      odsState.location, odsState.operands,
                      odsState.attributes.getDictionary(odsState.getContext()),
                      odsState.getRawProperties(),
                      odsState.regions, inferredReturnTypes)))
          odsState.addTypes(inferredReturnTypes);
        else
          ::mlir::detail::reportFatalInferReturnTypesError(odsState);
        
}

void FatRawBufferCastOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value source, /*optional*/::mlir::Value validBytes, /*optional*/::mlir::Value cacheSwizzleStride, /*optional*/bool boundsCheck, /*optional*/bool resetOffset) {
  odsState.addOperands(source);
  if (validBytes)
    odsState.addOperands(validBytes);
  if (cacheSwizzleStride)
    odsState.addOperands(cacheSwizzleStride);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, (validBytes ? 1 : 0), (cacheSwizzleStride ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().setBoundsCheck(boundsCheck);
  odsState.getOrAddProperties<Properties>().setResetOffset(resetOffset);
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void FatRawBufferCastOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 1u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<FatRawBufferCastOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void FatRawBufferCastOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 1u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<FatRawBufferCastOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
  ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
  if (::mlir::succeeded(FatRawBufferCastOp::inferReturnTypes(odsBuilder.getContext(),
          odsState.location, operands,
          odsState.attributes.getDictionary(odsState.getContext()),
          odsState.getRawProperties(),
          odsState.regions, inferredReturnTypes))) {
    assert(inferredReturnTypes.size() == 1u && "mismatched number of return types");
    odsState.addTypes(inferredReturnTypes);
  } else {
    ::llvm::report_fatal_error("Failed to infer result type(s).");
  }
}

void FatRawBufferCastOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 1u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void FatRawBufferCastOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 1u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties &>(properties));
  odsState.addAttributes(discardableAttributes);

  ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
  if (::mlir::succeeded(FatRawBufferCastOp::inferReturnTypes(odsBuilder.getContext(),
          odsState.location, operands,
          odsState.attributes.getDictionary(odsState.getContext()),
          odsState.getRawProperties(),
          odsState.regions, inferredReturnTypes))) {
    assert(inferredReturnTypes.size() == 1u && "mismatched number of return types");
    odsState.addTypes(inferredReturnTypes);
  } else {
    ::llvm::report_fatal_error("Failed to infer result type(s).");
  }
}

::llvm::LogicalResult FatRawBufferCastOp::verifyInvariantsImpl() {
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU4(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    if (valueGroup1.size() > 1) {
      return emitOpError("operand group starting at #") << index
          << " requires 0 or 1 element, but found " << valueGroup1.size();
    }

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU5(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup2 = getODSOperands(2);

    if (valueGroup2.size() > 1) {
      return emitOpError("operand group starting at #") << index
          << " requires 0 or 1 element, but found " << valueGroup2.size();
    }

    for (auto v : valueGroup2) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU6(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSResults(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU4(*this, v.getType(), "result", index++)))
        return ::mlir::failure();
    }
  }
  return ::mlir::success();
}

::llvm::LogicalResult FatRawBufferCastOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::mlir::ParseResult FatRawBufferCastOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand sourceRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> sourceOperands(&sourceRawOperand, 1);  ::llvm::SMLoc sourceOperandsLoc;
  (void)sourceOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> validBytesOperands;
  ::llvm::SMLoc validBytesOperandsLoc;
  (void)validBytesOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> cacheSwizzleStrideOperands;
  ::llvm::SMLoc cacheSwizzleStrideOperandsLoc;
  (void)cacheSwizzleStrideOperandsLoc;
  ::mlir::Type sourceRawType{};
  ::llvm::ArrayRef<::mlir::Type> sourceTypes(&sourceRawType, 1);
  ::mlir::Type resultRawType{};
  ::llvm::ArrayRef<::mlir::Type> resultTypes(&resultRawType, 1);

  sourceOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(sourceRawOperand))
    return ::mlir::failure();
  bool validBytesClause = false;
  bool cacheSwizzleStrideClause = false;
  bool boundsCheckClause = false;
  bool resetOffsetClause = false;
  while(true) {
if (succeeded(parser.parseOptionalKeyword("validBytes"))) {

  if (validBytesClause) {
    return parser.emitError(parser.getNameLoc())
          << "`validBytes` clause can appear at most once in the expansion of the "
             "oilist directive";
  }
  validBytesClause = true;
  if (parser.parseLParen())
    return ::mlir::failure();

  {
    validBytesOperandsLoc = parser.getCurrentLocation();
    ::mlir::OpAsmParser::UnresolvedOperand operand;
    ::mlir::OptionalParseResult parseResult =
                                    parser.parseOptionalOperand(operand);
    if (parseResult.has_value()) {
      if (failed(*parseResult))
        return ::mlir::failure();
      validBytesOperands.push_back(operand);
    }
  }
  if (parser.parseRParen())
    return ::mlir::failure();
    } else if (succeeded(parser.parseOptionalKeyword("cacheSwizzleStride"))) {

  if (cacheSwizzleStrideClause) {
    return parser.emitError(parser.getNameLoc())
          << "`cacheSwizzleStride` clause can appear at most once in the expansion of the "
             "oilist directive";
  }
  cacheSwizzleStrideClause = true;
  if (parser.parseLParen())
    return ::mlir::failure();

  {
    cacheSwizzleStrideOperandsLoc = parser.getCurrentLocation();
    ::mlir::OpAsmParser::UnresolvedOperand operand;
    ::mlir::OptionalParseResult parseResult =
                                    parser.parseOptionalOperand(operand);
    if (parseResult.has_value()) {
      if (failed(*parseResult))
        return ::mlir::failure();
      cacheSwizzleStrideOperands.push_back(operand);
    }
  }
  if (parser.parseRParen())
    return ::mlir::failure();
    } else if (succeeded(parser.parseOptionalKeyword("boundsCheck"))) {

  if (boundsCheckClause) {
    return parser.emitError(parser.getNameLoc())
          << "`boundsCheck` clause can appear at most once in the expansion of the "
             "oilist directive";
  }
  boundsCheckClause = true;
  if (parser.parseLParen())
    return ::mlir::failure();

  auto boundsCheckPropLoc = parser.getCurrentLocation();
  auto boundsCheckPropParseResult = [&](auto& propStorage) -> ::mlir::ParseResult {
    auto value = ::mlir::FieldParser<bool>::parse(parser);
    if (::mlir::failed(value))
      return ::mlir::failure();
    propStorage = std::move(*value);
    return ::mlir::success();
  }(result.getOrAddProperties<FatRawBufferCastOp::Properties>().boundsCheck);
  if (failed(boundsCheckPropParseResult)) {
    return parser.emitError(boundsCheckPropLoc, "invalid value for property boundsCheck, expected boolean");
  }
  if (parser.parseRParen())
    return ::mlir::failure();
    } else if (succeeded(parser.parseOptionalKeyword("resetOffset"))) {

  if (resetOffsetClause) {
    return parser.emitError(parser.getNameLoc())
          << "`resetOffset` clause can appear at most once in the expansion of the "
             "oilist directive";
  }
  resetOffsetClause = true;
    result.getOrAddProperties<FatRawBufferCastOp::Properties>().resetOffset = true;    } else  {
    break;
  }
}
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }
  if (parser.parseColon())
    return ::mlir::failure();

  {
    ::mlir::MemRefType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    sourceRawType = type;
  }
  if (parser.parseKeyword("to"))
    return ::mlir::failure();

  {
    ::mlir::MemRefType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    resultRawType = type;
  }
::llvm::copy(::llvm::ArrayRef<int32_t>({1, static_cast<int32_t>(validBytesOperands.size()), static_cast<int32_t>(cacheSwizzleStrideOperands.size())}), result.getOrAddProperties<FatRawBufferCastOp::Properties>().operandSegmentSizes.begin());
  ::mlir::Type odsBuildableType0 = parser.getBuilder().getIntegerType(32);
  ::mlir::Type odsBuildableType1 = parser.getBuilder().getIntegerType(14);
  result.addTypes(resultTypes);
  if (parser.resolveOperands(sourceOperands, sourceTypes, sourceOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(validBytesOperands, odsBuildableType0, validBytesOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(cacheSwizzleStrideOperands, odsBuildableType1, cacheSwizzleStrideOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void FatRawBufferCastOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  _odsPrinter << ' ';
  _odsPrinter << getSource();
  if (false || getValidBytes()) {
  _odsPrinter << ' ' << "validBytes";
  _odsPrinter << "(";
  if (::mlir::Value value = getValidBytes())
    _odsPrinter << value;
  _odsPrinter << ")";
  }
  if (false || getCacheSwizzleStride()) {
  _odsPrinter << ' ' << "cacheSwizzleStride";
  _odsPrinter << "(";
  if (::mlir::Value value = getCacheSwizzleStride())
    _odsPrinter << value;
  _odsPrinter << ")";
  }
  if (false || (getBoundsCheck() != true)) {
  _odsPrinter << ' ' << "boundsCheck";
  _odsPrinter << "(";
_odsPrinter << (getProperties().boundsCheck ? "true" : "false");
  _odsPrinter << ")";
  }
  if (false || (getResetOffset() != false)) {
  _odsPrinter << ' ' << "resetOffset";
  }
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("operandSegmentSizes");
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getSource().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::MemRefType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ' ' << "to";
  _odsPrinter << ' ';
  {
    auto type = getResult().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::MemRefType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
}

void FatRawBufferCastOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::FatRawBufferCastOp)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::GatherToLDSOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
GatherToLDSOpGenericAdaptorBase::GatherToLDSOpGenericAdaptorBase(GatherToLDSOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

std::pair<unsigned, unsigned> GatherToLDSOpGenericAdaptorBase::getODSOperandIndexAndLength(unsigned index, unsigned odsOperandsSize) {
  bool isVariadic[] = {false, true, false, true};
  int prevVariadicCount = 0;
  for (unsigned i = 0; i < index; ++i)
    if (isVariadic[i]) ++prevVariadicCount;

  // Calculate how many dynamic values a static variadic operand corresponds to.
  // This assumes all static variadic operands have the same dynamic value count.
  int variadicSize = (odsOperandsSize - 2) / 2;
  // `index` passed in as the parameter is the static index which counts each
  // operand (variadic or not) as size 1. So here for each previous static variadic
  // operand, we need to offset by (variadicSize - 1) to get where the dynamic
  // value pack for this static operand starts.
  int start = index + (variadicSize - 1) * prevVariadicCount;
  int size = isVariadic[index] ? variadicSize : 1;
  return {start, size};
}

::mlir::Type GatherToLDSOpGenericAdaptorBase::getTransferType() {
  auto attr = getTransferTypeAttr();
  return ::llvm::cast<::mlir::Type>(attr.getValue());
}

} // namespace detail
GatherToLDSOpAdaptor::GatherToLDSOpAdaptor(GatherToLDSOp op) : GatherToLDSOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult GatherToLDSOpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_transferType = getProperties().transferType; (void)tblgen_transferType;
  if (!tblgen_transferType) return emitError(loc, "'amdgpu.gather_to_lds' op ""requires attribute 'transferType'");

  if (tblgen_transferType && !(((::llvm::isa<::mlir::TypeAttr>(tblgen_transferType))) && ((::llvm::isa<::mlir::Type>(::llvm::cast<::mlir::TypeAttr>(tblgen_transferType).getValue()))) && ((true))))
    return emitError(loc, "'amdgpu.gather_to_lds' op ""attribute 'transferType' failed to satisfy constraint: any type attribute");
  return ::mlir::success();
}

std::pair<unsigned, unsigned> GatherToLDSOp::getODSOperandIndexAndLength(unsigned index) {
  bool isVariadic[] = {false, true, false, true};
  int prevVariadicCount = 0;
  for (unsigned i = 0; i < index; ++i)
    if (isVariadic[i]) ++prevVariadicCount;

  // Calculate how many dynamic values a static variadic operand corresponds to.
  // This assumes all static variadic operands have the same dynamic value count.
  int variadicSize = (getOperation()->getNumOperands() - 2) / 2;
  // `index` passed in as the parameter is the static index which counts each
  // operand (variadic or not) as size 1. So here for each previous static variadic
  // operand, we need to offset by (variadicSize - 1) to get where the dynamic
  // value pack for this static operand starts.
  int start = index + (variadicSize - 1) * prevVariadicCount;
  int size = isVariadic[index] ? variadicSize : 1;
  return {start, size};
}

::mlir::MutableOperandRange GatherToLDSOp::getSrcIndicesMutable() {
  auto range = getODSOperandIndexAndLength(1);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second);
  return mutableRange;
}

::mlir::MutableOperandRange GatherToLDSOp::getDstIndicesMutable() {
  auto range = getODSOperandIndexAndLength(3);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second);
  return mutableRange;
}

::llvm::LogicalResult GatherToLDSOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.transferType;
       auto attr = dict.get("transferType");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `transferType` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
  return ::mlir::success();
}

::mlir::Attribute GatherToLDSOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.transferType;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("transferType",
                                       propStorage));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code GatherToLDSOp::computePropertiesHash(const Properties &prop) {
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.transferType.getAsOpaquePointer()));
}

std::optional<mlir::Attribute> GatherToLDSOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "transferType")
      return prop.transferType;
  return std::nullopt;
}

void GatherToLDSOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "transferType") {
       prop.transferType = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.transferType)>>(value);
       return;
    }
}

void GatherToLDSOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.transferType) attrs.append("transferType", prop.transferType);
}

::llvm::LogicalResult GatherToLDSOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getTransferTypeAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU6(attr, "transferType", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult GatherToLDSOp::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readAttribute(prop.transferType)))
    return ::mlir::failure();
  return ::mlir::success();
}

void GatherToLDSOp::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;
  writer.writeAttribute(prop.transferType);
}

::mlir::Type GatherToLDSOp::getTransferType() {
  auto attr = getTransferTypeAttr();
  return ::llvm::cast<::mlir::Type>(attr.getValue());
}

void GatherToLDSOp::setTransferType(::mlir::Type attrValue) {
  getProperties().transferType = ::mlir::TypeAttr::get(attrValue);
}

void GatherToLDSOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value src, ::mlir::ValueRange srcIndices, ::mlir::Value dst, ::mlir::ValueRange dstIndices, ::mlir::TypeAttr transferType) {
  odsState.addOperands(src);
  odsState.addOperands(srcIndices);
  odsState.addOperands(dst);
  odsState.addOperands(dstIndices);
  odsState.getOrAddProperties<Properties>().transferType = transferType;
}

void GatherToLDSOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value src, ::mlir::ValueRange srcIndices, ::mlir::Value dst, ::mlir::ValueRange dstIndices, ::mlir::TypeAttr transferType) {
  odsState.addOperands(src);
  odsState.addOperands(srcIndices);
  odsState.addOperands(dst);
  odsState.addOperands(dstIndices);
  odsState.getOrAddProperties<Properties>().transferType = transferType;
  assert(resultTypes.size() == 0u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void GatherToLDSOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value src, ::mlir::ValueRange srcIndices, ::mlir::Value dst, ::mlir::ValueRange dstIndices, ::mlir::Type transferType) {
  odsState.addOperands(src);
  odsState.addOperands(srcIndices);
  odsState.addOperands(dst);
  odsState.addOperands(dstIndices);
  odsState.getOrAddProperties<Properties>().transferType = ::mlir::TypeAttr::get(transferType);
}

void GatherToLDSOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value src, ::mlir::ValueRange srcIndices, ::mlir::Value dst, ::mlir::ValueRange dstIndices, ::mlir::Type transferType) {
  odsState.addOperands(src);
  odsState.addOperands(srcIndices);
  odsState.addOperands(dst);
  odsState.addOperands(dstIndices);
  odsState.getOrAddProperties<Properties>().transferType = ::mlir::TypeAttr::get(transferType);
  assert(resultTypes.size() == 0u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void GatherToLDSOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 0u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<GatherToLDSOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void GatherToLDSOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 0u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

::llvm::LogicalResult GatherToLDSOp::verifyInvariantsImpl() {
  auto tblgen_transferType = getProperties().transferType; (void)tblgen_transferType;
  if (!tblgen_transferType) return emitOpError("requires attribute 'transferType'");

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU6(*this, tblgen_transferType, "transferType")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU4(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU7(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup2 = getODSOperands(2);

    for (auto v : valueGroup2) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU4(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup3 = getODSOperands(3);

    for (auto v : valueGroup3) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU7(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  return ::mlir::success();
}

::llvm::LogicalResult GatherToLDSOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::mlir::ParseResult GatherToLDSOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand srcRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> srcOperands(&srcRawOperand, 1);  ::llvm::SMLoc srcOperandsLoc;
  (void)srcOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> srcIndicesOperands;
  ::llvm::SMLoc srcIndicesOperandsLoc;
  (void)srcIndicesOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand dstRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> dstOperands(&dstRawOperand, 1);  ::llvm::SMLoc dstOperandsLoc;
  (void)dstOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> dstIndicesOperands;
  ::llvm::SMLoc dstIndicesOperandsLoc;
  (void)dstIndicesOperandsLoc;
  ::mlir::TypeAttr transferTypeAttr;
  ::mlir::Type srcRawType{};
  ::llvm::ArrayRef<::mlir::Type> srcTypes(&srcRawType, 1);
  ::mlir::Type dstRawType{};
  ::llvm::ArrayRef<::mlir::Type> dstTypes(&dstRawType, 1);

  srcOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(srcRawOperand))
    return ::mlir::failure();
  if (parser.parseLSquare())
    return ::mlir::failure();

  srcIndicesOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperandList(srcIndicesOperands))
    return ::mlir::failure();
  if (parser.parseRSquare())
    return ::mlir::failure();
  if (parser.parseComma())
    return ::mlir::failure();

  dstOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(dstRawOperand))
    return ::mlir::failure();
  if (parser.parseLSquare())
    return ::mlir::failure();

  dstIndicesOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperandList(dstIndicesOperands))
    return ::mlir::failure();
  if (parser.parseRSquare())
    return ::mlir::failure();
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }
  if (parser.parseColon())
    return ::mlir::failure();

  if (parser.parseCustomAttributeWithFallback(transferTypeAttr, parser.getBuilder().getType<::mlir::NoneType>())) {
    return ::mlir::failure();
  }
  if (transferTypeAttr) result.getOrAddProperties<GatherToLDSOp::Properties>().transferType = transferTypeAttr;
  if (parser.parseComma())
    return ::mlir::failure();

  {
    ::mlir::MemRefType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    srcRawType = type;
  }
  if (parser.parseComma())
    return ::mlir::failure();

  {
    ::mlir::MemRefType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    dstRawType = type;
  }
  ::mlir::Type odsBuildableType0 = parser.getBuilder().getIndexType();
  if (parser.resolveOperands(srcOperands, srcTypes, srcOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(srcIndicesOperands, odsBuildableType0, srcIndicesOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(dstOperands, dstTypes, dstOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(dstIndicesOperands, odsBuildableType0, dstIndicesOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void GatherToLDSOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  _odsPrinter << ' ';
  _odsPrinter << getSrc();
  _odsPrinter << "[";
  _odsPrinter << getSrcIndices();
  _odsPrinter << "]";
  _odsPrinter << ",";
  _odsPrinter << ' ';
  _odsPrinter << getDst();
  _odsPrinter << "[";
  _odsPrinter << getDstIndices();
  _odsPrinter << "]";
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("transferType");
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  _odsPrinter.printAttributeWithoutType(getTransferTypeAttr());
  _odsPrinter << ",";
  _odsPrinter << ' ';
  {
    auto type = getSrc().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::MemRefType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ",";
  _odsPrinter << ' ';
  {
    auto type = getDst().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::MemRefType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
}

void GatherToLDSOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
  {
    auto valueRange = getODSOperandIndexAndLength(0);
    for (unsigned idx = valueRange.first; idx < valueRange.first + valueRange.second; idx++) {
      effects.emplace_back(::mlir::MemoryEffects::Read::get(), &getOperation()->getOpOperand(idx), 0, false, ::mlir::SideEffects::DefaultResource::get());
    }
  }
  {
    auto valueRange = getODSOperandIndexAndLength(2);
    for (unsigned idx = valueRange.first; idx < valueRange.first + valueRange.second; idx++) {
      effects.emplace_back(::mlir::MemoryEffects::Write::get(), &getOperation()->getOpOperand(idx), 0, false, ::mlir::SideEffects::DefaultResource::get());
    }
  }
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::GatherToLDSOp)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::LDSBarrierOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
LDSBarrierOpGenericAdaptorBase::LDSBarrierOpGenericAdaptorBase(LDSBarrierOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

} // namespace detail
LDSBarrierOpAdaptor::LDSBarrierOpAdaptor(LDSBarrierOp op) : LDSBarrierOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult LDSBarrierOpAdaptor::verify(::mlir::Location loc) {
  return ::mlir::success();
}

::llvm::LogicalResult LDSBarrierOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }
      return ::mlir::success();
}

::mlir::Attribute LDSBarrierOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code LDSBarrierOp::computePropertiesHash(const Properties &prop) {
  using llvm::hash_value;
  return llvm::hash_combine();
}

std::optional<mlir::Attribute> LDSBarrierOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
  return std::nullopt;
}

void LDSBarrierOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
}

void LDSBarrierOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
}

::llvm::LogicalResult LDSBarrierOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    return ::mlir::success();
}

void LDSBarrierOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState) {
}

void LDSBarrierOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes) {
  assert(resultTypes.size() == 0u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void LDSBarrierOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() == 0u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 0u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void LDSBarrierOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() == 0u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 0u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

::llvm::LogicalResult LDSBarrierOp::verifyInvariantsImpl() {
  return ::mlir::success();
}

::llvm::LogicalResult LDSBarrierOp::verifyInvariants() {
  return verifyInvariantsImpl();
}

::mlir::ParseResult LDSBarrierOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }
  return ::mlir::success();
}

void LDSBarrierOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::LDSBarrierOp)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::MFMAOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
MFMAOpGenericAdaptorBase::MFMAOpGenericAdaptorBase(MFMAOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

uint32_t MFMAOpGenericAdaptorBase::getM() {
  auto attr = getMAttr();
  return attr.getValue().getZExtValue();
}

uint32_t MFMAOpGenericAdaptorBase::getN() {
  auto attr = getNAttr();
  return attr.getValue().getZExtValue();
}

uint32_t MFMAOpGenericAdaptorBase::getK() {
  auto attr = getKAttr();
  return attr.getValue().getZExtValue();
}

uint32_t MFMAOpGenericAdaptorBase::getBlocks() {
  auto attr = getBlocksAttr();
  return attr.getValue().getZExtValue();
}

::mlir::IntegerAttr MFMAOpGenericAdaptorBase::getCbszAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::IntegerAttr>(getProperties().cbsz);
  return attr;
}

uint32_t MFMAOpGenericAdaptorBase::getCbsz() {
  auto attr = getCbszAttr();
  return attr.getValue().getZExtValue();
}

::mlir::IntegerAttr MFMAOpGenericAdaptorBase::getAbidAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::IntegerAttr>(getProperties().abid);
  return attr;
}

uint32_t MFMAOpGenericAdaptorBase::getAbid() {
  auto attr = getAbidAttr();
  return attr.getValue().getZExtValue();
}

::mlir::amdgpu::MFMAPermBAttr MFMAOpGenericAdaptorBase::getBlgpAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::amdgpu::MFMAPermBAttr>(getProperties().blgp);
  return attr;
}

::mlir::amdgpu::MFMAPermB MFMAOpGenericAdaptorBase::getBlgp() {
  auto attr = getBlgpAttr();
  return attr.getValue();
}

::mlir::UnitAttr MFMAOpGenericAdaptorBase::getReducePrecisionAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::UnitAttr>(getProperties().reducePrecision);
  if (!attr)
    attr = ((false) ? ::mlir::Builder(odsAttrs.getContext()).getUnitAttr() : nullptr);
  return attr;
}

bool MFMAOpGenericAdaptorBase::getReducePrecision() {
  auto attr = getReducePrecisionAttr();
    if (!attr)
      return ((false) ? ::mlir::Builder(odsAttrs.getContext()).getUnitAttr() : nullptr) != nullptr;
  return attr != nullptr;
}

::mlir::UnitAttr MFMAOpGenericAdaptorBase::getNegateAAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::UnitAttr>(getProperties().negateA);
  if (!attr)
    attr = ((false) ? ::mlir::Builder(odsAttrs.getContext()).getUnitAttr() : nullptr);
  return attr;
}

bool MFMAOpGenericAdaptorBase::getNegateA() {
  auto attr = getNegateAAttr();
    if (!attr)
      return ((false) ? ::mlir::Builder(odsAttrs.getContext()).getUnitAttr() : nullptr) != nullptr;
  return attr != nullptr;
}

::mlir::UnitAttr MFMAOpGenericAdaptorBase::getNegateBAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::UnitAttr>(getProperties().negateB);
  if (!attr)
    attr = ((false) ? ::mlir::Builder(odsAttrs.getContext()).getUnitAttr() : nullptr);
  return attr;
}

bool MFMAOpGenericAdaptorBase::getNegateB() {
  auto attr = getNegateBAttr();
    if (!attr)
      return ((false) ? ::mlir::Builder(odsAttrs.getContext()).getUnitAttr() : nullptr) != nullptr;
  return attr != nullptr;
}

::mlir::UnitAttr MFMAOpGenericAdaptorBase::getNegateCAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::UnitAttr>(getProperties().negateC);
  if (!attr)
    attr = ((false) ? ::mlir::Builder(odsAttrs.getContext()).getUnitAttr() : nullptr);
  return attr;
}

bool MFMAOpGenericAdaptorBase::getNegateC() {
  auto attr = getNegateCAttr();
    if (!attr)
      return ((false) ? ::mlir::Builder(odsAttrs.getContext()).getUnitAttr() : nullptr) != nullptr;
  return attr != nullptr;
}

} // namespace detail
MFMAOpAdaptor::MFMAOpAdaptor(MFMAOp op) : MFMAOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult MFMAOpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_abid = getProperties().abid; (void)tblgen_abid;
  auto tblgen_blgp = getProperties().blgp; (void)tblgen_blgp;
  auto tblgen_blocks = getProperties().blocks; (void)tblgen_blocks;
  if (!tblgen_blocks) return emitError(loc, "'amdgpu.mfma' op ""requires attribute 'blocks'");
  auto tblgen_cbsz = getProperties().cbsz; (void)tblgen_cbsz;
  auto tblgen_k = getProperties().k; (void)tblgen_k;
  if (!tblgen_k) return emitError(loc, "'amdgpu.mfma' op ""requires attribute 'k'");
  auto tblgen_m = getProperties().m; (void)tblgen_m;
  if (!tblgen_m) return emitError(loc, "'amdgpu.mfma' op ""requires attribute 'm'");
  auto tblgen_n = getProperties().n; (void)tblgen_n;
  if (!tblgen_n) return emitError(loc, "'amdgpu.mfma' op ""requires attribute 'n'");
  auto tblgen_negateA = getProperties().negateA; (void)tblgen_negateA;
  auto tblgen_negateB = getProperties().negateB; (void)tblgen_negateB;
  auto tblgen_negateC = getProperties().negateC; (void)tblgen_negateC;
  auto tblgen_reducePrecision = getProperties().reducePrecision; (void)tblgen_reducePrecision;

  if (tblgen_m && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_m))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_m).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.mfma' op ""attribute 'm' failed to satisfy constraint: 32-bit signless integer attribute");

  if (tblgen_n && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_n))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_n).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.mfma' op ""attribute 'n' failed to satisfy constraint: 32-bit signless integer attribute");

  if (tblgen_k && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_k))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_k).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.mfma' op ""attribute 'k' failed to satisfy constraint: 32-bit signless integer attribute");

  if (tblgen_blocks && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_blocks))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_blocks).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.mfma' op ""attribute 'blocks' failed to satisfy constraint: 32-bit signless integer attribute");

  if (tblgen_cbsz && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_cbsz))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_cbsz).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.mfma' op ""attribute 'cbsz' failed to satisfy constraint: 32-bit signless integer attribute");

  if (tblgen_abid && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_abid))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_abid).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.mfma' op ""attribute 'abid' failed to satisfy constraint: 32-bit signless integer attribute");

  if (tblgen_blgp && !((::llvm::isa<::mlir::amdgpu::MFMAPermBAttr>(tblgen_blgp))))
    return emitError(loc, "'amdgpu.mfma' op ""attribute 'blgp' failed to satisfy constraint: The possible permutations of the lanes storing B available in an MFMA");

  if (tblgen_reducePrecision && !((::llvm::isa<::mlir::UnitAttr>(tblgen_reducePrecision))))
    return emitError(loc, "'amdgpu.mfma' op ""attribute 'reducePrecision' failed to satisfy constraint: unit attribute");

  if (tblgen_negateA && !((::llvm::isa<::mlir::UnitAttr>(tblgen_negateA))))
    return emitError(loc, "'amdgpu.mfma' op ""attribute 'negateA' failed to satisfy constraint: unit attribute");

  if (tblgen_negateB && !((::llvm::isa<::mlir::UnitAttr>(tblgen_negateB))))
    return emitError(loc, "'amdgpu.mfma' op ""attribute 'negateB' failed to satisfy constraint: unit attribute");

  if (tblgen_negateC && !((::llvm::isa<::mlir::UnitAttr>(tblgen_negateC))))
    return emitError(loc, "'amdgpu.mfma' op ""attribute 'negateC' failed to satisfy constraint: unit attribute");
  return ::mlir::success();
}

::llvm::LogicalResult MFMAOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.abid;
       auto attr = dict.get("abid");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `abid` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.blgp;
       auto attr = dict.get("blgp");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `blgp` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.blocks;
       auto attr = dict.get("blocks");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `blocks` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.cbsz;
       auto attr = dict.get("cbsz");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `cbsz` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.k;
       auto attr = dict.get("k");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `k` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.m;
       auto attr = dict.get("m");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `m` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.n;
       auto attr = dict.get("n");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `n` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.negateA;
       auto attr = dict.get("negateA");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `negateA` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.negateB;
       auto attr = dict.get("negateB");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `negateB` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.negateC;
       auto attr = dict.get("negateC");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `negateC` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.reducePrecision;
       auto attr = dict.get("reducePrecision");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `reducePrecision` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
  return ::mlir::success();
}

::mlir::Attribute MFMAOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.abid;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("abid",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.blgp;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("blgp",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.blocks;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("blocks",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.cbsz;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("cbsz",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.k;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("k",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.m;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("m",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.n;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("n",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.negateA;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("negateA",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.negateB;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("negateB",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.negateC;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("negateC",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.reducePrecision;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("reducePrecision",
                                       propStorage));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code MFMAOp::computePropertiesHash(const Properties &prop) {
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.abid.getAsOpaquePointer()), 
    llvm::hash_value(prop.blgp.getAsOpaquePointer()), 
    llvm::hash_value(prop.blocks.getAsOpaquePointer()), 
    llvm::hash_value(prop.cbsz.getAsOpaquePointer()), 
    llvm::hash_value(prop.k.getAsOpaquePointer()), 
    llvm::hash_value(prop.m.getAsOpaquePointer()), 
    llvm::hash_value(prop.n.getAsOpaquePointer()), 
    llvm::hash_value(prop.negateA.getAsOpaquePointer()), 
    llvm::hash_value(prop.negateB.getAsOpaquePointer()), 
    llvm::hash_value(prop.negateC.getAsOpaquePointer()), 
    llvm::hash_value(prop.reducePrecision.getAsOpaquePointer()));
}

std::optional<mlir::Attribute> MFMAOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "abid")
      return prop.abid;

    if (name == "blgp")
      return prop.blgp;

    if (name == "blocks")
      return prop.blocks;

    if (name == "cbsz")
      return prop.cbsz;

    if (name == "k")
      return prop.k;

    if (name == "m")
      return prop.m;

    if (name == "n")
      return prop.n;

    if (name == "negateA")
      return prop.negateA;

    if (name == "negateB")
      return prop.negateB;

    if (name == "negateC")
      return prop.negateC;

    if (name == "reducePrecision")
      return prop.reducePrecision;
  return std::nullopt;
}

void MFMAOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "abid") {
       prop.abid = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.abid)>>(value);
       return;
    }

    if (name == "blgp") {
       prop.blgp = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.blgp)>>(value);
       return;
    }

    if (name == "blocks") {
       prop.blocks = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.blocks)>>(value);
       return;
    }

    if (name == "cbsz") {
       prop.cbsz = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.cbsz)>>(value);
       return;
    }

    if (name == "k") {
       prop.k = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.k)>>(value);
       return;
    }

    if (name == "m") {
       prop.m = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.m)>>(value);
       return;
    }

    if (name == "n") {
       prop.n = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.n)>>(value);
       return;
    }

    if (name == "negateA") {
       prop.negateA = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.negateA)>>(value);
       return;
    }

    if (name == "negateB") {
       prop.negateB = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.negateB)>>(value);
       return;
    }

    if (name == "negateC") {
       prop.negateC = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.negateC)>>(value);
       return;
    }

    if (name == "reducePrecision") {
       prop.reducePrecision = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.reducePrecision)>>(value);
       return;
    }
}

void MFMAOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.abid) attrs.append("abid", prop.abid);

    if (prop.blgp) attrs.append("blgp", prop.blgp);

    if (prop.blocks) attrs.append("blocks", prop.blocks);

    if (prop.cbsz) attrs.append("cbsz", prop.cbsz);

    if (prop.k) attrs.append("k", prop.k);

    if (prop.m) attrs.append("m", prop.m);

    if (prop.n) attrs.append("n", prop.n);

    if (prop.negateA) attrs.append("negateA", prop.negateA);

    if (prop.negateB) attrs.append("negateB", prop.negateB);

    if (prop.negateC) attrs.append("negateC", prop.negateC);

    if (prop.reducePrecision) attrs.append("reducePrecision", prop.reducePrecision);
}

::llvm::LogicalResult MFMAOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getAbidAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "abid", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getBlgpAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU7(attr, "blgp", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getBlocksAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "blocks", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getCbszAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "cbsz", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getKAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "k", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getMAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "m", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getNAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "n", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getNegateAAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU8(attr, "negateA", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getNegateBAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU8(attr, "negateB", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getNegateCAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU8(attr, "negateC", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getReducePrecisionAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU8(attr, "reducePrecision", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult MFMAOp::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readOptionalAttribute(prop.abid)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.blgp)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readAttribute(prop.blocks)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.cbsz)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readAttribute(prop.k)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readAttribute(prop.m)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readAttribute(prop.n)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.negateA)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.negateB)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.negateC)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.reducePrecision)))
    return ::mlir::failure();
  return ::mlir::success();
}

void MFMAOp::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;

  writer.writeOptionalAttribute(prop.abid);

  writer.writeOptionalAttribute(prop.blgp);
  writer.writeAttribute(prop.blocks);

  writer.writeOptionalAttribute(prop.cbsz);
  writer.writeAttribute(prop.k);
  writer.writeAttribute(prop.m);
  writer.writeAttribute(prop.n);

  writer.writeOptionalAttribute(prop.negateA);

  writer.writeOptionalAttribute(prop.negateB);

  writer.writeOptionalAttribute(prop.negateC);

  writer.writeOptionalAttribute(prop.reducePrecision);
}

uint32_t MFMAOp::getM() {
  auto attr = getMAttr();
  return attr.getValue().getZExtValue();
}

uint32_t MFMAOp::getN() {
  auto attr = getNAttr();
  return attr.getValue().getZExtValue();
}

uint32_t MFMAOp::getK() {
  auto attr = getKAttr();
  return attr.getValue().getZExtValue();
}

uint32_t MFMAOp::getBlocks() {
  auto attr = getBlocksAttr();
  return attr.getValue().getZExtValue();
}

uint32_t MFMAOp::getCbsz() {
  auto attr = getCbszAttr();
  return attr.getValue().getZExtValue();
}

uint32_t MFMAOp::getAbid() {
  auto attr = getAbidAttr();
  return attr.getValue().getZExtValue();
}

::mlir::amdgpu::MFMAPermB MFMAOp::getBlgp() {
  auto attr = getBlgpAttr();
  return attr.getValue();
}

bool MFMAOp::getReducePrecision() {
  auto attr = getReducePrecisionAttr();
    if (!attr)
      return ((false) ? ::mlir::Builder((*this)->getContext()).getUnitAttr() : nullptr) != nullptr;
  return attr != nullptr;
}

bool MFMAOp::getNegateA() {
  auto attr = getNegateAAttr();
    if (!attr)
      return ((false) ? ::mlir::Builder((*this)->getContext()).getUnitAttr() : nullptr) != nullptr;
  return attr != nullptr;
}

bool MFMAOp::getNegateB() {
  auto attr = getNegateBAttr();
    if (!attr)
      return ((false) ? ::mlir::Builder((*this)->getContext()).getUnitAttr() : nullptr) != nullptr;
  return attr != nullptr;
}

bool MFMAOp::getNegateC() {
  auto attr = getNegateCAttr();
    if (!attr)
      return ((false) ? ::mlir::Builder((*this)->getContext()).getUnitAttr() : nullptr) != nullptr;
  return attr != nullptr;
}

void MFMAOp::setM(uint32_t attrValue) {
  getProperties().m = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void MFMAOp::setN(uint32_t attrValue) {
  getProperties().n = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void MFMAOp::setK(uint32_t attrValue) {
  getProperties().k = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void MFMAOp::setBlocks(uint32_t attrValue) {
  getProperties().blocks = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void MFMAOp::setCbsz(uint32_t attrValue) {
  getProperties().cbsz = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void MFMAOp::setAbid(uint32_t attrValue) {
  getProperties().abid = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void MFMAOp::setBlgp(::mlir::amdgpu::MFMAPermB attrValue) {
  getProperties().blgp = ::mlir::amdgpu::MFMAPermBAttr::get(::mlir::Builder((*this)->getContext()).getContext(), attrValue);
}

void MFMAOp::setReducePrecision(bool attrValue) {
    auto &odsProp = getProperties().reducePrecision;
    if (attrValue)
      odsProp = ((attrValue) ? ::mlir::Builder((*this)->getContext()).getUnitAttr() : nullptr);
    else
      odsProp = nullptr;
}

void MFMAOp::setNegateA(bool attrValue) {
    auto &odsProp = getProperties().negateA;
    if (attrValue)
      odsProp = ((attrValue) ? ::mlir::Builder((*this)->getContext()).getUnitAttr() : nullptr);
    else
      odsProp = nullptr;
}

void MFMAOp::setNegateB(bool attrValue) {
    auto &odsProp = getProperties().negateB;
    if (attrValue)
      odsProp = ((attrValue) ? ::mlir::Builder((*this)->getContext()).getUnitAttr() : nullptr);
    else
      odsProp = nullptr;
}

void MFMAOp::setNegateC(bool attrValue) {
    auto &odsProp = getProperties().negateC;
    if (attrValue)
      odsProp = ((attrValue) ? ::mlir::Builder((*this)->getContext()).getUnitAttr() : nullptr);
    else
      odsProp = nullptr;
}

void MFMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type destD, ::mlir::IntegerAttr m, ::mlir::IntegerAttr n, ::mlir::IntegerAttr k, ::mlir::IntegerAttr blocks, ::mlir::Value sourceA, ::mlir::Value sourceB, ::mlir::Value destC, ::mlir::IntegerAttr cbsz, ::mlir::IntegerAttr abid, ::mlir::amdgpu::MFMAPermBAttr blgp, /*optional*/::mlir::UnitAttr reducePrecision, /*optional*/::mlir::UnitAttr negateA, /*optional*/::mlir::UnitAttr negateB, /*optional*/::mlir::UnitAttr negateC) {
  odsState.addOperands(sourceA);
  odsState.addOperands(sourceB);
  odsState.addOperands(destC);
  odsState.getOrAddProperties<Properties>().m = m;
  odsState.getOrAddProperties<Properties>().n = n;
  odsState.getOrAddProperties<Properties>().k = k;
  odsState.getOrAddProperties<Properties>().blocks = blocks;
  if (cbsz) {
    odsState.getOrAddProperties<Properties>().cbsz = cbsz;
  }
  if (abid) {
    odsState.getOrAddProperties<Properties>().abid = abid;
  }
  if (blgp) {
    odsState.getOrAddProperties<Properties>().blgp = blgp;
  }
  if (reducePrecision) {
    odsState.getOrAddProperties<Properties>().reducePrecision = reducePrecision;
  }
  if (negateA) {
    odsState.getOrAddProperties<Properties>().negateA = negateA;
  }
  if (negateB) {
    odsState.getOrAddProperties<Properties>().negateB = negateB;
  }
  if (negateC) {
    odsState.getOrAddProperties<Properties>().negateC = negateC;
  }
  odsState.addTypes(destD);
}

void MFMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::IntegerAttr m, ::mlir::IntegerAttr n, ::mlir::IntegerAttr k, ::mlir::IntegerAttr blocks, ::mlir::Value sourceA, ::mlir::Value sourceB, ::mlir::Value destC, ::mlir::IntegerAttr cbsz, ::mlir::IntegerAttr abid, ::mlir::amdgpu::MFMAPermBAttr blgp, /*optional*/::mlir::UnitAttr reducePrecision, /*optional*/::mlir::UnitAttr negateA, /*optional*/::mlir::UnitAttr negateB, /*optional*/::mlir::UnitAttr negateC) {
  odsState.addOperands(sourceA);
  odsState.addOperands(sourceB);
  odsState.addOperands(destC);
  odsState.getOrAddProperties<Properties>().m = m;
  odsState.getOrAddProperties<Properties>().n = n;
  odsState.getOrAddProperties<Properties>().k = k;
  odsState.getOrAddProperties<Properties>().blocks = blocks;
  if (cbsz) {
    odsState.getOrAddProperties<Properties>().cbsz = cbsz;
  }
  if (abid) {
    odsState.getOrAddProperties<Properties>().abid = abid;
  }
  if (blgp) {
    odsState.getOrAddProperties<Properties>().blgp = blgp;
  }
  if (reducePrecision) {
    odsState.getOrAddProperties<Properties>().reducePrecision = reducePrecision;
  }
  if (negateA) {
    odsState.getOrAddProperties<Properties>().negateA = negateA;
  }
  if (negateB) {
    odsState.getOrAddProperties<Properties>().negateB = negateB;
  }
  if (negateC) {
    odsState.getOrAddProperties<Properties>().negateC = negateC;
  }

        ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
        if (::mlir::succeeded(MFMAOp::inferReturnTypes(odsBuilder.getContext(),
                      odsState.location, odsState.operands,
                      odsState.attributes.getDictionary(odsState.getContext()),
                      odsState.getRawProperties(),
                      odsState.regions, inferredReturnTypes)))
          odsState.addTypes(inferredReturnTypes);
        else
          ::mlir::detail::reportFatalInferReturnTypesError(odsState);
        
}

void MFMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::IntegerAttr m, ::mlir::IntegerAttr n, ::mlir::IntegerAttr k, ::mlir::IntegerAttr blocks, ::mlir::Value sourceA, ::mlir::Value sourceB, ::mlir::Value destC, ::mlir::IntegerAttr cbsz, ::mlir::IntegerAttr abid, ::mlir::amdgpu::MFMAPermBAttr blgp, /*optional*/::mlir::UnitAttr reducePrecision, /*optional*/::mlir::UnitAttr negateA, /*optional*/::mlir::UnitAttr negateB, /*optional*/::mlir::UnitAttr negateC) {
  odsState.addOperands(sourceA);
  odsState.addOperands(sourceB);
  odsState.addOperands(destC);
  odsState.getOrAddProperties<Properties>().m = m;
  odsState.getOrAddProperties<Properties>().n = n;
  odsState.getOrAddProperties<Properties>().k = k;
  odsState.getOrAddProperties<Properties>().blocks = blocks;
  if (cbsz) {
    odsState.getOrAddProperties<Properties>().cbsz = cbsz;
  }
  if (abid) {
    odsState.getOrAddProperties<Properties>().abid = abid;
  }
  if (blgp) {
    odsState.getOrAddProperties<Properties>().blgp = blgp;
  }
  if (reducePrecision) {
    odsState.getOrAddProperties<Properties>().reducePrecision = reducePrecision;
  }
  if (negateA) {
    odsState.getOrAddProperties<Properties>().negateA = negateA;
  }
  if (negateB) {
    odsState.getOrAddProperties<Properties>().negateB = negateB;
  }
  if (negateC) {
    odsState.getOrAddProperties<Properties>().negateC = negateC;
  }
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void MFMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type destD, uint32_t m, uint32_t n, uint32_t k, uint32_t blocks, ::mlir::Value sourceA, ::mlir::Value sourceB, ::mlir::Value destC, uint32_t cbsz, uint32_t abid, ::mlir::amdgpu::MFMAPermB blgp, /*optional*/bool reducePrecision, /*optional*/bool negateA, /*optional*/bool negateB, /*optional*/bool negateC) {
  odsState.addOperands(sourceA);
  odsState.addOperands(sourceB);
  odsState.addOperands(destC);
  odsState.getOrAddProperties<Properties>().m = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), m);
  odsState.getOrAddProperties<Properties>().n = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), n);
  odsState.getOrAddProperties<Properties>().k = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), k);
  odsState.getOrAddProperties<Properties>().blocks = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), blocks);
  odsState.getOrAddProperties<Properties>().cbsz = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), cbsz);
  odsState.getOrAddProperties<Properties>().abid = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), abid);
  odsState.getOrAddProperties<Properties>().blgp = ::mlir::amdgpu::MFMAPermBAttr::get(odsBuilder.getContext(), blgp);
  if (reducePrecision) {
    odsState.getOrAddProperties<Properties>().reducePrecision = ((reducePrecision) ? odsBuilder.getUnitAttr() : nullptr);
  }
  if (negateA) {
    odsState.getOrAddProperties<Properties>().negateA = ((negateA) ? odsBuilder.getUnitAttr() : nullptr);
  }
  if (negateB) {
    odsState.getOrAddProperties<Properties>().negateB = ((negateB) ? odsBuilder.getUnitAttr() : nullptr);
  }
  if (negateC) {
    odsState.getOrAddProperties<Properties>().negateC = ((negateC) ? odsBuilder.getUnitAttr() : nullptr);
  }
  odsState.addTypes(destD);
}

void MFMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, uint32_t m, uint32_t n, uint32_t k, uint32_t blocks, ::mlir::Value sourceA, ::mlir::Value sourceB, ::mlir::Value destC, uint32_t cbsz, uint32_t abid, ::mlir::amdgpu::MFMAPermB blgp, /*optional*/bool reducePrecision, /*optional*/bool negateA, /*optional*/bool negateB, /*optional*/bool negateC) {
  odsState.addOperands(sourceA);
  odsState.addOperands(sourceB);
  odsState.addOperands(destC);
  odsState.getOrAddProperties<Properties>().m = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), m);
  odsState.getOrAddProperties<Properties>().n = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), n);
  odsState.getOrAddProperties<Properties>().k = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), k);
  odsState.getOrAddProperties<Properties>().blocks = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), blocks);
  odsState.getOrAddProperties<Properties>().cbsz = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), cbsz);
  odsState.getOrAddProperties<Properties>().abid = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), abid);
  odsState.getOrAddProperties<Properties>().blgp = ::mlir::amdgpu::MFMAPermBAttr::get(odsBuilder.getContext(), blgp);
  if (reducePrecision) {
    odsState.getOrAddProperties<Properties>().reducePrecision = ((reducePrecision) ? odsBuilder.getUnitAttr() : nullptr);
  }
  if (negateA) {
    odsState.getOrAddProperties<Properties>().negateA = ((negateA) ? odsBuilder.getUnitAttr() : nullptr);
  }
  if (negateB) {
    odsState.getOrAddProperties<Properties>().negateB = ((negateB) ? odsBuilder.getUnitAttr() : nullptr);
  }
  if (negateC) {
    odsState.getOrAddProperties<Properties>().negateC = ((negateC) ? odsBuilder.getUnitAttr() : nullptr);
  }

        ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
        if (::mlir::succeeded(MFMAOp::inferReturnTypes(odsBuilder.getContext(),
                      odsState.location, odsState.operands,
                      odsState.attributes.getDictionary(odsState.getContext()),
                      odsState.getRawProperties(),
                      odsState.regions, inferredReturnTypes)))
          odsState.addTypes(inferredReturnTypes);
        else
          ::mlir::detail::reportFatalInferReturnTypesError(odsState);
        
}

void MFMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, uint32_t m, uint32_t n, uint32_t k, uint32_t blocks, ::mlir::Value sourceA, ::mlir::Value sourceB, ::mlir::Value destC, uint32_t cbsz, uint32_t abid, ::mlir::amdgpu::MFMAPermB blgp, /*optional*/bool reducePrecision, /*optional*/bool negateA, /*optional*/bool negateB, /*optional*/bool negateC) {
  odsState.addOperands(sourceA);
  odsState.addOperands(sourceB);
  odsState.addOperands(destC);
  odsState.getOrAddProperties<Properties>().m = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), m);
  odsState.getOrAddProperties<Properties>().n = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), n);
  odsState.getOrAddProperties<Properties>().k = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), k);
  odsState.getOrAddProperties<Properties>().blocks = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), blocks);
  odsState.getOrAddProperties<Properties>().cbsz = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), cbsz);
  odsState.getOrAddProperties<Properties>().abid = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), abid);
  odsState.getOrAddProperties<Properties>().blgp = ::mlir::amdgpu::MFMAPermBAttr::get(odsBuilder.getContext(), blgp);
  if (reducePrecision) {
    odsState.getOrAddProperties<Properties>().reducePrecision = ((reducePrecision) ? odsBuilder.getUnitAttr() : nullptr);
  }
  if (negateA) {
    odsState.getOrAddProperties<Properties>().negateA = ((negateA) ? odsBuilder.getUnitAttr() : nullptr);
  }
  if (negateB) {
    odsState.getOrAddProperties<Properties>().negateB = ((negateB) ? odsBuilder.getUnitAttr() : nullptr);
  }
  if (negateC) {
    odsState.getOrAddProperties<Properties>().negateC = ((negateC) ? odsBuilder.getUnitAttr() : nullptr);
  }
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void MFMAOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() == 3u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<MFMAOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void MFMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() == 3u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<MFMAOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
  ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
  if (::mlir::succeeded(MFMAOp::inferReturnTypes(odsBuilder.getContext(),
          odsState.location, operands,
          odsState.attributes.getDictionary(odsState.getContext()),
          odsState.getRawProperties(),
          odsState.regions, inferredReturnTypes))) {
    assert(inferredReturnTypes.size() == 1u && "mismatched number of return types");
    odsState.addTypes(inferredReturnTypes);
  } else {
    ::llvm::report_fatal_error("Failed to infer result type(s).");
  }
}

void MFMAOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() == 3u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void MFMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() == 3u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties &>(properties));
  odsState.addAttributes(discardableAttributes);

  ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
  if (::mlir::succeeded(MFMAOp::inferReturnTypes(odsBuilder.getContext(),
          odsState.location, operands,
          odsState.attributes.getDictionary(odsState.getContext()),
          odsState.getRawProperties(),
          odsState.regions, inferredReturnTypes))) {
    assert(inferredReturnTypes.size() == 1u && "mismatched number of return types");
    odsState.addTypes(inferredReturnTypes);
  } else {
    ::llvm::report_fatal_error("Failed to infer result type(s).");
  }
}

void MFMAOp::populateDefaultProperties(::mlir::OperationName opName, Properties &properties) {
  ::mlir::Builder odsBuilder(opName.getContext());
  if (!properties.cbsz)
    properties.cbsz = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), 0);
  if (!properties.abid)
    properties.abid = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), 0);
  if (!properties.blgp)
    properties.blgp = ::mlir::amdgpu::MFMAPermBAttr::get(odsBuilder.getContext(), ::mlir::amdgpu::MFMAPermB::none);
}

::llvm::LogicalResult MFMAOp::verifyInvariantsImpl() {
  auto tblgen_abid = getProperties().abid; (void)tblgen_abid;
  auto tblgen_blgp = getProperties().blgp; (void)tblgen_blgp;
  auto tblgen_blocks = getProperties().blocks; (void)tblgen_blocks;
  if (!tblgen_blocks) return emitOpError("requires attribute 'blocks'");
  auto tblgen_cbsz = getProperties().cbsz; (void)tblgen_cbsz;
  auto tblgen_k = getProperties().k; (void)tblgen_k;
  if (!tblgen_k) return emitOpError("requires attribute 'k'");
  auto tblgen_m = getProperties().m; (void)tblgen_m;
  if (!tblgen_m) return emitOpError("requires attribute 'm'");
  auto tblgen_n = getProperties().n; (void)tblgen_n;
  if (!tblgen_n) return emitOpError("requires attribute 'n'");
  auto tblgen_negateA = getProperties().negateA; (void)tblgen_negateA;
  auto tblgen_negateB = getProperties().negateB; (void)tblgen_negateB;
  auto tblgen_negateC = getProperties().negateC; (void)tblgen_negateC;
  auto tblgen_reducePrecision = getProperties().reducePrecision; (void)tblgen_reducePrecision;

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_m, "m")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_n, "n")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_k, "k")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_blocks, "blocks")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_cbsz, "cbsz")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_abid, "abid")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU7(*this, tblgen_blgp, "blgp")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU8(*this, tblgen_reducePrecision, "reducePrecision")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU8(*this, tblgen_negateA, "negateA")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU8(*this, tblgen_negateB, "negateB")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU8(*this, tblgen_negateC, "negateC")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU8(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU8(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup2 = getODSOperands(2);

    for (auto v : valueGroup2) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU9(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSResults(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU9(*this, v.getType(), "result", index++)))
        return ::mlir::failure();
    }
  }
  if (!((((*this->getODSOperands(2).begin()).getType()) == ((*this->getODSResults(0).begin()).getType()) && ((*this->getODSResults(0).begin()).getType()) == ((*this->getODSOperands(2).begin()).getType()))))
    return emitOpError("failed to verify that all of {destC, destD} have same type");
  return ::mlir::success();
}

::llvm::LogicalResult MFMAOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::llvm::LogicalResult MFMAOp::inferReturnTypes(::mlir::MLIRContext *context, ::std::optional<::mlir::Location> location, ::mlir::ValueRange operands, ::mlir::DictionaryAttr attributes, ::mlir::OpaqueProperties properties, ::mlir::RegionRange regions, ::llvm::SmallVectorImpl<::mlir::Type>&inferredReturnTypes) {
  inferredReturnTypes.resize(1);
  ::mlir::Builder odsBuilder(context);
  if (operands.size() <= 2)
    return ::mlir::failure();
  ::mlir::Type odsInferredType0 = operands[2].getType();
  inferredReturnTypes[0] = odsInferredType0;
  return ::mlir::success();
}

::mlir::ParseResult MFMAOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand sourceARawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> sourceAOperands(&sourceARawOperand, 1);  ::llvm::SMLoc sourceAOperandsLoc;
  (void)sourceAOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand sourceBRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> sourceBOperands(&sourceBRawOperand, 1);  ::llvm::SMLoc sourceBOperandsLoc;
  (void)sourceBOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand destCRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> destCOperands(&destCRawOperand, 1);  ::llvm::SMLoc destCOperandsLoc;
  (void)destCOperandsLoc;
  ::mlir::amdgpu::MFMAPermBAttr blgpAttr;
  ::mlir::Type sourceARawType{};
  ::llvm::ArrayRef<::mlir::Type> sourceATypes(&sourceARawType, 1);
  ::mlir::Type sourceBRawType{};
  ::llvm::ArrayRef<::mlir::Type> sourceBTypes(&sourceBRawType, 1);
  ::mlir::Type destCRawType{};
  ::llvm::ArrayRef<::mlir::Type> destCTypes(&destCRawType, 1);

  sourceAOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(sourceARawOperand))
    return ::mlir::failure();
  if (parser.parseStar())
    return ::mlir::failure();

  sourceBOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(sourceBRawOperand))
    return ::mlir::failure();
  if (parser.parsePlus())
    return ::mlir::failure();

  destCOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(destCRawOperand))
    return ::mlir::failure();
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }
  if (parser.parseKeyword("blgp"))
    return ::mlir::failure();
  if (parser.parseEqual())
    return ::mlir::failure();

  if (parser.parseCustomAttributeWithFallback(blgpAttr, ::mlir::Type{})) {
    return ::mlir::failure();
  }
  if (blgpAttr) result.getOrAddProperties<MFMAOp::Properties>().blgp = blgpAttr;
  if (parser.parseColon())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    sourceARawType = type;
  }
  if (parser.parseComma())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    sourceBRawType = type;
  }
  if (parser.parseComma())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    destCRawType = type;
  }
  result.addTypes(destCTypes[0]);
  if (parser.resolveOperands(sourceAOperands, sourceATypes, sourceAOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(sourceBOperands, sourceBTypes, sourceBOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(destCOperands, destCTypes, destCOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void MFMAOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  _odsPrinter << ' ';
  _odsPrinter << getSourceA();
  _odsPrinter << ' ' << "*";
  _odsPrinter << ' ';
  _odsPrinter << getSourceB();
  _odsPrinter << ' ' << "+";
  _odsPrinter << ' ';
  _odsPrinter << getDestC();
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("blgp");
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getCbszAttr();
     if(attr && (attr == odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), 0)))
       elidedAttrs.push_back("cbsz");
  }
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getAbidAttr();
     if(attr && (attr == odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), 0)))
       elidedAttrs.push_back("abid");
  }
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getBlgpAttr();
     if(attr && (attr == ::mlir::amdgpu::MFMAPermBAttr::get(odsBuilder.getContext(), ::mlir::amdgpu::MFMAPermB::none)))
       elidedAttrs.push_back("blgp");
  }
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getReducePrecisionAttr();
     if(attr && (attr == ((false) ? odsBuilder.getUnitAttr() : nullptr)))
       elidedAttrs.push_back("reducePrecision");
  }
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getNegateAAttr();
     if(attr && (attr == ((false) ? odsBuilder.getUnitAttr() : nullptr)))
       elidedAttrs.push_back("negateA");
  }
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getNegateBAttr();
     if(attr && (attr == ((false) ? odsBuilder.getUnitAttr() : nullptr)))
       elidedAttrs.push_back("negateB");
  }
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getNegateCAttr();
     if(attr && (attr == ((false) ? odsBuilder.getUnitAttr() : nullptr)))
       elidedAttrs.push_back("negateC");
  }
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ' << "blgp";
  _odsPrinter << ' ' << "=";
  _odsPrinter << ' ';
_odsPrinter.printStrippedAttrOrType(getBlgpAttr());
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getSourceA().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ",";
  _odsPrinter << ' ';
  {
    auto type = getSourceB().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ",";
  _odsPrinter << ' ';
  {
    auto type = getDestC().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
}

void MFMAOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::MFMAOp)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::PackedScaledTruncOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
PackedScaledTruncOpGenericAdaptorBase::PackedScaledTruncOpGenericAdaptorBase(PackedScaledTruncOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

std::pair<unsigned, unsigned> PackedScaledTruncOpGenericAdaptorBase::getODSOperandIndexAndLength(unsigned index, unsigned odsOperandsSize) {
  bool isVariadic[] = {false, false, true};
  int prevVariadicCount = 0;
  for (unsigned i = 0; i < index; ++i)
    if (isVariadic[i]) ++prevVariadicCount;

  // Calculate how many dynamic values a static variadic operand corresponds to.
  // This assumes all static variadic operands have the same dynamic value count.
  int variadicSize = (odsOperandsSize - 2) / 1;
  // `index` passed in as the parameter is the static index which counts each
  // operand (variadic or not) as size 1. So here for each previous static variadic
  // operand, we need to offset by (variadicSize - 1) to get where the dynamic
  // value pack for this static operand starts.
  int start = index + (variadicSize - 1) * prevVariadicCount;
  int size = isVariadic[index] ? variadicSize : 1;
  return {start, size};
}

uint32_t PackedScaledTruncOpGenericAdaptorBase::getIndex() {
  auto attr = getIndexAttr();
  return attr.getValue().getZExtValue();
}

} // namespace detail
PackedScaledTruncOpAdaptor::PackedScaledTruncOpAdaptor(PackedScaledTruncOp op) : PackedScaledTruncOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult PackedScaledTruncOpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_index = getProperties().index; (void)tblgen_index;
  if (!tblgen_index) return emitError(loc, "'amdgpu.packed_scaled_trunc' op ""requires attribute 'index'");

  if (tblgen_index && !((((::llvm::isa<::mlir::IntegerAttr>(tblgen_index))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_index).getType().isSignlessInteger(32)))) && ((!::llvm::cast<::mlir::IntegerAttr>(tblgen_index).getValue().isNegative())) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_index).getInt() <= 7))))
    return emitError(loc, "'amdgpu.packed_scaled_trunc' op ""attribute 'index' failed to satisfy constraint: 32-bit signless integer attribute whose value is non-negative whose maximum value is 7");
  return ::mlir::success();
}

std::pair<unsigned, unsigned> PackedScaledTruncOp::getODSOperandIndexAndLength(unsigned index) {
  bool isVariadic[] = {false, false, true};
  int prevVariadicCount = 0;
  for (unsigned i = 0; i < index; ++i)
    if (isVariadic[i]) ++prevVariadicCount;

  // Calculate how many dynamic values a static variadic operand corresponds to.
  // This assumes all static variadic operands have the same dynamic value count.
  int variadicSize = (getOperation()->getNumOperands() - 2) / 1;
  // `index` passed in as the parameter is the static index which counts each
  // operand (variadic or not) as size 1. So here for each previous static variadic
  // operand, we need to offset by (variadicSize - 1) to get where the dynamic
  // value pack for this static operand starts.
  int start = index + (variadicSize - 1) * prevVariadicCount;
  int size = isVariadic[index] ? variadicSize : 1;
  return {start, size};
}

::mlir::MutableOperandRange PackedScaledTruncOp::getExistingMutable() {
  auto range = getODSOperandIndexAndLength(2);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second);
  return mutableRange;
}

::llvm::LogicalResult PackedScaledTruncOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.index;
       auto attr = dict.get("index");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `index` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
  return ::mlir::success();
}

::mlir::Attribute PackedScaledTruncOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.index;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("index",
                                       propStorage));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code PackedScaledTruncOp::computePropertiesHash(const Properties &prop) {
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.index.getAsOpaquePointer()));
}

std::optional<mlir::Attribute> PackedScaledTruncOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "index")
      return prop.index;
  return std::nullopt;
}

void PackedScaledTruncOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "index") {
       prop.index = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.index)>>(value);
       return;
    }
}

void PackedScaledTruncOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.index) attrs.append("index", prop.index);
}

::llvm::LogicalResult PackedScaledTruncOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getIndexAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU9(attr, "index", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult PackedScaledTruncOp::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readAttribute(prop.index)))
    return ::mlir::failure();
  return ::mlir::success();
}

void PackedScaledTruncOp::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;
  writer.writeAttribute(prop.index);
}

uint32_t PackedScaledTruncOp::getIndex() {
  auto attr = getIndexAttr();
  return attr.getValue().getZExtValue();
}

void PackedScaledTruncOp::setIndex(uint32_t attrValue) {
  getProperties().index = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void PackedScaledTruncOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type res, ::mlir::Value source, ::mlir::Value scale, ::mlir::IntegerAttr index, /*optional*/::mlir::Value existing) {
  odsState.addOperands(source);
  odsState.addOperands(scale);
  if (existing)
    odsState.addOperands(existing);
  odsState.getOrAddProperties<Properties>().index = index;
  odsState.addTypes(res);
}

void PackedScaledTruncOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value source, ::mlir::Value scale, ::mlir::IntegerAttr index, /*optional*/::mlir::Value existing) {
  odsState.addOperands(source);
  odsState.addOperands(scale);
  if (existing)
    odsState.addOperands(existing);
  odsState.getOrAddProperties<Properties>().index = index;
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void PackedScaledTruncOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type res, ::mlir::Value source, ::mlir::Value scale, uint32_t index, /*optional*/::mlir::Value existing) {
  odsState.addOperands(source);
  odsState.addOperands(scale);
  if (existing)
    odsState.addOperands(existing);
  odsState.getOrAddProperties<Properties>().index = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), index);
  odsState.addTypes(res);
}

void PackedScaledTruncOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value source, ::mlir::Value scale, uint32_t index, /*optional*/::mlir::Value existing) {
  odsState.addOperands(source);
  odsState.addOperands(scale);
  if (existing)
    odsState.addOperands(existing);
  odsState.getOrAddProperties<Properties>().index = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), index);
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void PackedScaledTruncOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<PackedScaledTruncOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void PackedScaledTruncOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

::llvm::LogicalResult PackedScaledTruncOp::verifyInvariantsImpl() {
  auto tblgen_index = getProperties().index; (void)tblgen_index;
  if (!tblgen_index) return emitOpError("requires attribute 'index'");

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU9(*this, tblgen_index, "index")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU10(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU11(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup2 = getODSOperands(2);

    if (valueGroup2.size() > 1) {
      return emitOpError("operand group starting at #") << index
          << " requires 0 or 1 element, but found " << valueGroup2.size();
    }

    for (auto v : valueGroup2) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU12(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSResults(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU12(*this, v.getType(), "result", index++)))
        return ::mlir::failure();
    }
  }
  return ::mlir::success();
}

::llvm::LogicalResult PackedScaledTruncOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::mlir::ParseResult PackedScaledTruncOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand sourceRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> sourceOperands(&sourceRawOperand, 1);  ::llvm::SMLoc sourceOperandsLoc;
  (void)sourceOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> existingOperands;
  ::llvm::SMLoc existingOperandsLoc;
  (void)existingOperandsLoc;
  ::mlir::IntegerAttr indexAttr;
  ::mlir::OpAsmParser::UnresolvedOperand scaleRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> scaleOperands(&scaleRawOperand, 1);  ::llvm::SMLoc scaleOperandsLoc;
  (void)scaleOperandsLoc;
  ::mlir::Type sourceRawType{};
  ::llvm::ArrayRef<::mlir::Type> sourceTypes(&sourceRawType, 1);
  ::mlir::Type resRawType{};
  ::llvm::ArrayRef<::mlir::Type> resTypes(&resRawType, 1);
  ::llvm::SmallVector<::mlir::Type, 1> existingTypes;
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }

  sourceOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(sourceRawOperand))
    return ::mlir::failure();
  if (parser.parseKeyword("into"))
    return ::mlir::failure();

  {
    existingOperandsLoc = parser.getCurrentLocation();
    ::mlir::OpAsmParser::UnresolvedOperand operand;
    ::mlir::OptionalParseResult parseResult =
                                    parser.parseOptionalOperand(operand);
    if (parseResult.has_value()) {
      if (failed(*parseResult))
        return ::mlir::failure();
      existingOperands.push_back(operand);
    }
  }
  if (!existingOperands.empty()) {
  } else {
  if (parser.parseKeyword("undef"))
    return ::mlir::failure();
  }
  if (parser.parseLSquare())
    return ::mlir::failure();

  if (parser.parseCustomAttributeWithFallback(indexAttr, parser.getBuilder().getIntegerType(32))) {
    return ::mlir::failure();
  }
  if (indexAttr) result.getOrAddProperties<PackedScaledTruncOp::Properties>().index = indexAttr;
  if (parser.parseRSquare())
    return ::mlir::failure();
  if (parser.parseComma())
    return ::mlir::failure();

  scaleOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(scaleRawOperand))
    return ::mlir::failure();
  if (parser.parseColon())
    return ::mlir::failure();

  {
    ::mlir::VectorType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    sourceRawType = type;
  }
  if (parser.parseKeyword("to"))
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    resRawType = type;
  }
  if (::mlir::succeeded(parser.parseOptionalKeyword("into"))) {

  {
    ::mlir::Type optionalType;
    ::mlir::OptionalParseResult parseResult =
                                    parser.parseOptionalType(optionalType);
    if (parseResult.has_value()) {
      if (failed(*parseResult))
        return ::mlir::failure();
      existingTypes.push_back(optionalType);
    }
  }
  }
  ::mlir::Type odsBuildableType0 = parser.getBuilder().getF32Type();
  result.addTypes(resTypes);
  if (parser.resolveOperands(sourceOperands, sourceTypes, sourceOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(scaleOperands, odsBuildableType0, scaleOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(existingOperands, existingTypes, existingOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void PackedScaledTruncOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("index");
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ';
  _odsPrinter << getSource();
  _odsPrinter << ' ' << "into";
  if (getExisting()) {
    _odsPrinter << ' ';
    if (::mlir::Value value = getExisting())
      _odsPrinter << value;
  } else {
    _odsPrinter << ' ' << "undef";
  }
  _odsPrinter << "[";
  _odsPrinter.printAttributeWithoutType(getIndexAttr());
  _odsPrinter << "]";
  _odsPrinter << ",";
  _odsPrinter << ' ';
  _odsPrinter << getScale();
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getSource().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::VectorType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ' ' << "to";
  _odsPrinter << ' ';
  {
    auto type = getRes().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  if (getExisting()) {
    _odsPrinter << ' ' << "into";
    _odsPrinter << ' ';
    _odsPrinter << (getExisting() ? ::llvm::ArrayRef<::mlir::Type>(getExisting().getType()) : ::llvm::ArrayRef<::mlir::Type>());
  }
}

void PackedScaledTruncOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::PackedScaledTruncOp)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::PackedStochRoundFp8Op definitions
//===----------------------------------------------------------------------===//

namespace detail {
PackedStochRoundFp8OpGenericAdaptorBase::PackedStochRoundFp8OpGenericAdaptorBase(PackedStochRoundFp8Op op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

std::pair<unsigned, unsigned> PackedStochRoundFp8OpGenericAdaptorBase::getODSOperandIndexAndLength(unsigned index, unsigned odsOperandsSize) {
  bool isVariadic[] = {false, false, true};
  int prevVariadicCount = 0;
  for (unsigned i = 0; i < index; ++i)
    if (isVariadic[i]) ++prevVariadicCount;

  // Calculate how many dynamic values a static variadic operand corresponds to.
  // This assumes all static variadic operands have the same dynamic value count.
  int variadicSize = (odsOperandsSize - 2) / 1;
  // `index` passed in as the parameter is the static index which counts each
  // operand (variadic or not) as size 1. So here for each previous static variadic
  // operand, we need to offset by (variadicSize - 1) to get where the dynamic
  // value pack for this static operand starts.
  int start = index + (variadicSize - 1) * prevVariadicCount;
  int size = isVariadic[index] ? variadicSize : 1;
  return {start, size};
}

uint32_t PackedStochRoundFp8OpGenericAdaptorBase::getStoreIndex() {
  auto attr = getStoreIndexAttr();
  return attr.getValue().getZExtValue();
}

} // namespace detail
PackedStochRoundFp8OpAdaptor::PackedStochRoundFp8OpAdaptor(PackedStochRoundFp8Op op) : PackedStochRoundFp8OpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult PackedStochRoundFp8OpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_storeIndex = getProperties().storeIndex; (void)tblgen_storeIndex;
  if (!tblgen_storeIndex) return emitError(loc, "'amdgpu.packed_stoch_round_fp8' op ""requires attribute 'storeIndex'");

  if (tblgen_storeIndex && !((((::llvm::isa<::mlir::IntegerAttr>(tblgen_storeIndex))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_storeIndex).getType().isSignlessInteger(32)))) && ((!::llvm::cast<::mlir::IntegerAttr>(tblgen_storeIndex).getValue().isNegative())) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_storeIndex).getInt() <= 3))))
    return emitError(loc, "'amdgpu.packed_stoch_round_fp8' op ""attribute 'storeIndex' failed to satisfy constraint: 32-bit signless integer attribute whose value is non-negative whose maximum value is 3");
  return ::mlir::success();
}

std::pair<unsigned, unsigned> PackedStochRoundFp8Op::getODSOperandIndexAndLength(unsigned index) {
  bool isVariadic[] = {false, false, true};
  int prevVariadicCount = 0;
  for (unsigned i = 0; i < index; ++i)
    if (isVariadic[i]) ++prevVariadicCount;

  // Calculate how many dynamic values a static variadic operand corresponds to.
  // This assumes all static variadic operands have the same dynamic value count.
  int variadicSize = (getOperation()->getNumOperands() - 2) / 1;
  // `index` passed in as the parameter is the static index which counts each
  // operand (variadic or not) as size 1. So here for each previous static variadic
  // operand, we need to offset by (variadicSize - 1) to get where the dynamic
  // value pack for this static operand starts.
  int start = index + (variadicSize - 1) * prevVariadicCount;
  int size = isVariadic[index] ? variadicSize : 1;
  return {start, size};
}

::mlir::MutableOperandRange PackedStochRoundFp8Op::getExistingMutable() {
  auto range = getODSOperandIndexAndLength(2);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second);
  return mutableRange;
}

::llvm::LogicalResult PackedStochRoundFp8Op::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.storeIndex;
       auto attr = dict.get("storeIndex");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `storeIndex` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
  return ::mlir::success();
}

::mlir::Attribute PackedStochRoundFp8Op::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.storeIndex;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("storeIndex",
                                       propStorage));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code PackedStochRoundFp8Op::computePropertiesHash(const Properties &prop) {
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.storeIndex.getAsOpaquePointer()));
}

std::optional<mlir::Attribute> PackedStochRoundFp8Op::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "storeIndex")
      return prop.storeIndex;
  return std::nullopt;
}

void PackedStochRoundFp8Op::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "storeIndex") {
       prop.storeIndex = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.storeIndex)>>(value);
       return;
    }
}

void PackedStochRoundFp8Op::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.storeIndex) attrs.append("storeIndex", prop.storeIndex);
}

::llvm::LogicalResult PackedStochRoundFp8Op::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getStoreIndexAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU5(attr, "storeIndex", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult PackedStochRoundFp8Op::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readAttribute(prop.storeIndex)))
    return ::mlir::failure();
  return ::mlir::success();
}

void PackedStochRoundFp8Op::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;
  writer.writeAttribute(prop.storeIndex);
}

uint32_t PackedStochRoundFp8Op::getStoreIndex() {
  auto attr = getStoreIndexAttr();
  return attr.getValue().getZExtValue();
}

void PackedStochRoundFp8Op::setStoreIndex(uint32_t attrValue) {
  getProperties().storeIndex = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void PackedStochRoundFp8Op::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type res, ::mlir::Value source, ::mlir::Value stochiasticParam, ::mlir::IntegerAttr storeIndex, /*optional*/::mlir::Value existing) {
  odsState.addOperands(source);
  odsState.addOperands(stochiasticParam);
  if (existing)
    odsState.addOperands(existing);
  odsState.getOrAddProperties<Properties>().storeIndex = storeIndex;
  odsState.addTypes(res);
}

void PackedStochRoundFp8Op::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value source, ::mlir::Value stochiasticParam, ::mlir::IntegerAttr storeIndex, /*optional*/::mlir::Value existing) {
  odsState.addOperands(source);
  odsState.addOperands(stochiasticParam);
  if (existing)
    odsState.addOperands(existing);
  odsState.getOrAddProperties<Properties>().storeIndex = storeIndex;
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void PackedStochRoundFp8Op::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type res, ::mlir::Value source, ::mlir::Value stochiasticParam, uint32_t storeIndex, /*optional*/::mlir::Value existing) {
  odsState.addOperands(source);
  odsState.addOperands(stochiasticParam);
  if (existing)
    odsState.addOperands(existing);
  odsState.getOrAddProperties<Properties>().storeIndex = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), storeIndex);
  odsState.addTypes(res);
}

void PackedStochRoundFp8Op::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value source, ::mlir::Value stochiasticParam, uint32_t storeIndex, /*optional*/::mlir::Value existing) {
  odsState.addOperands(source);
  odsState.addOperands(stochiasticParam);
  if (existing)
    odsState.addOperands(existing);
  odsState.getOrAddProperties<Properties>().storeIndex = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), storeIndex);
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void PackedStochRoundFp8Op::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<PackedStochRoundFp8Op::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void PackedStochRoundFp8Op::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

::llvm::LogicalResult PackedStochRoundFp8Op::verifyInvariantsImpl() {
  auto tblgen_storeIndex = getProperties().storeIndex; (void)tblgen_storeIndex;
  if (!tblgen_storeIndex) return emitOpError("requires attribute 'storeIndex'");

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU5(*this, tblgen_storeIndex, "storeIndex")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU11(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU5(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup2 = getODSOperands(2);

    if (valueGroup2.size() > 1) {
      return emitOpError("operand group starting at #") << index
          << " requires 0 or 1 element, but found " << valueGroup2.size();
    }

    for (auto v : valueGroup2) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU13(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSResults(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU13(*this, v.getType(), "result", index++)))
        return ::mlir::failure();
    }
  }
  return ::mlir::success();
}

::llvm::LogicalResult PackedStochRoundFp8Op::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::mlir::ParseResult PackedStochRoundFp8Op::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand sourceRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> sourceOperands(&sourceRawOperand, 1);  ::llvm::SMLoc sourceOperandsLoc;
  (void)sourceOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand stochiasticParamRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> stochiasticParamOperands(&stochiasticParamRawOperand, 1);  ::llvm::SMLoc stochiasticParamOperandsLoc;
  (void)stochiasticParamOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> existingOperands;
  ::llvm::SMLoc existingOperandsLoc;
  (void)existingOperandsLoc;
  ::mlir::IntegerAttr storeIndexAttr;
  ::mlir::Type sourceRawType{};
  ::llvm::ArrayRef<::mlir::Type> sourceTypes(&sourceRawType, 1);
  ::mlir::Type resRawType{};
  ::llvm::ArrayRef<::mlir::Type> resTypes(&resRawType, 1);
  ::llvm::SmallVector<::mlir::Type, 1> existingTypes;
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }

  sourceOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(sourceRawOperand))
    return ::mlir::failure();
  if (parser.parsePlus())
    return ::mlir::failure();

  stochiasticParamOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(stochiasticParamRawOperand))
    return ::mlir::failure();
  if (parser.parseKeyword("into"))
    return ::mlir::failure();

  {
    existingOperandsLoc = parser.getCurrentLocation();
    ::mlir::OpAsmParser::UnresolvedOperand operand;
    ::mlir::OptionalParseResult parseResult =
                                    parser.parseOptionalOperand(operand);
    if (parseResult.has_value()) {
      if (failed(*parseResult))
        return ::mlir::failure();
      existingOperands.push_back(operand);
    }
  }
  if (!existingOperands.empty()) {
  } else {
  if (parser.parseKeyword("undef"))
    return ::mlir::failure();
  }
  if (parser.parseLSquare())
    return ::mlir::failure();

  if (parser.parseCustomAttributeWithFallback(storeIndexAttr, parser.getBuilder().getIntegerType(32))) {
    return ::mlir::failure();
  }
  if (storeIndexAttr) result.getOrAddProperties<PackedStochRoundFp8Op::Properties>().storeIndex = storeIndexAttr;
  if (parser.parseRSquare())
    return ::mlir::failure();
  if (parser.parseColon())
    return ::mlir::failure();

  {
    ::mlir::FloatType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    sourceRawType = type;
  }
  if (parser.parseKeyword("to"))
    return ::mlir::failure();

  {
    ::mlir::VectorType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    resRawType = type;
  }
  if (::mlir::succeeded(parser.parseOptionalKeyword("into"))) {

  {
    ::mlir::Type optionalType;
    ::mlir::OptionalParseResult parseResult =
                                    parser.parseOptionalType(optionalType);
    if (parseResult.has_value()) {
      if (failed(*parseResult))
        return ::mlir::failure();
      existingTypes.push_back(optionalType);
    }
  }
  }
  ::mlir::Type odsBuildableType0 = parser.getBuilder().getIntegerType(32);
  result.addTypes(resTypes);
  if (parser.resolveOperands(sourceOperands, sourceTypes, sourceOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(stochiasticParamOperands, odsBuildableType0, stochiasticParamOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(existingOperands, existingTypes, existingOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void PackedStochRoundFp8Op::print(::mlir::OpAsmPrinter &_odsPrinter) {
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("storeIndex");
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ';
  _odsPrinter << getSource();
  _odsPrinter << ' ' << "+";
  _odsPrinter << ' ';
  _odsPrinter << getStochiasticParam();
  _odsPrinter << ' ' << "into";
  if (getExisting()) {
    _odsPrinter << ' ';
    if (::mlir::Value value = getExisting())
      _odsPrinter << value;
  } else {
    _odsPrinter << ' ' << "undef";
  }
  _odsPrinter << "[";
  _odsPrinter.printAttributeWithoutType(getStoreIndexAttr());
  _odsPrinter << "]";
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getSource().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::FloatType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ' ' << "to";
  _odsPrinter << ' ';
  {
    auto type = getRes().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::VectorType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  if (getExisting()) {
    _odsPrinter << ' ' << "into";
    _odsPrinter << ' ';
    _odsPrinter << (getExisting() ? ::llvm::ArrayRef<::mlir::Type>(getExisting().getType()) : ::llvm::ArrayRef<::mlir::Type>());
  }
}

void PackedStochRoundFp8Op::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::PackedStochRoundFp8Op)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::PackedTrunc2xFp8Op definitions
//===----------------------------------------------------------------------===//

namespace detail {
PackedTrunc2xFp8OpGenericAdaptorBase::PackedTrunc2xFp8OpGenericAdaptorBase(PackedTrunc2xFp8Op op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

std::pair<unsigned, unsigned> PackedTrunc2xFp8OpGenericAdaptorBase::getODSOperandIndexAndLength(unsigned index, unsigned odsOperandsSize) {
  ::llvm::ArrayRef<int32_t> sizeAttr = getProperties().operandSegmentSizes;

  unsigned start = 0;
  for (unsigned i = 0; i < index; ++i)
    start += sizeAttr[i];
  return {start, sizeAttr[index]};
}

uint32_t PackedTrunc2xFp8OpGenericAdaptorBase::getWordIndex() {
  auto attr = getWordIndexAttr();
  return attr.getValue().getZExtValue();
}

} // namespace detail
PackedTrunc2xFp8OpAdaptor::PackedTrunc2xFp8OpAdaptor(PackedTrunc2xFp8Op op) : PackedTrunc2xFp8OpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult PackedTrunc2xFp8OpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_wordIndex = getProperties().wordIndex; (void)tblgen_wordIndex;
  if (!tblgen_wordIndex) return emitError(loc, "'amdgpu.packed_trunc_2xfp8' op ""requires attribute 'wordIndex'");

  if (tblgen_wordIndex && !((((::llvm::isa<::mlir::IntegerAttr>(tblgen_wordIndex))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_wordIndex).getType().isSignlessInteger(32)))) && ((!::llvm::cast<::mlir::IntegerAttr>(tblgen_wordIndex).getValue().isNegative())) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_wordIndex).getInt() <= 1))))
    return emitError(loc, "'amdgpu.packed_trunc_2xfp8' op ""attribute 'wordIndex' failed to satisfy constraint: 32-bit signless integer attribute whose value is non-negative whose maximum value is 1");
  return ::mlir::success();
}

std::pair<unsigned, unsigned> PackedTrunc2xFp8Op::getODSOperandIndexAndLength(unsigned index) {
  ::llvm::ArrayRef<int32_t> sizeAttr = getProperties().operandSegmentSizes;

  unsigned start = 0;
  for (unsigned i = 0; i < index; ++i)
    start += sizeAttr[i];
  return {start, sizeAttr[index]};
}

::mlir::MutableOperandRange PackedTrunc2xFp8Op::getSourceBMutable() {
  auto range = getODSOperandIndexAndLength(1);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second, ::mlir::MutableOperandRange::OperandSegment(1u, {getOperandSegmentSizesAttrName(), ::mlir::DenseI32ArrayAttr::get(getContext(), getProperties().operandSegmentSizes)}));
  return mutableRange;
}

::mlir::MutableOperandRange PackedTrunc2xFp8Op::getExistingMutable() {
  auto range = getODSOperandIndexAndLength(2);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second, ::mlir::MutableOperandRange::OperandSegment(2u, {getOperandSegmentSizesAttrName(), ::mlir::DenseI32ArrayAttr::get(getContext(), getProperties().operandSegmentSizes)}));
  return mutableRange;
}

::llvm::LogicalResult PackedTrunc2xFp8Op::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.wordIndex;
       auto attr = dict.get("wordIndex");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `wordIndex` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
{

      auto setFromAttr = [] (auto &propStorage, ::mlir::Attribute propAttr,
               ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) -> ::mlir::LogicalResult {
        return convertFromAttribute(propStorage, propAttr, emitError);
      };
         auto attr = dict.get("operandSegmentSizes");   if (!attr) attr = dict.get("operand_segment_sizes");;
;
      if (attr && ::mlir::failed(setFromAttr(prop.operandSegmentSizes, attr, emitError)))
        return ::mlir::failure();
  }
  return ::mlir::success();
}

::mlir::Attribute PackedTrunc2xFp8Op::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.wordIndex;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("wordIndex",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.operandSegmentSizes;
      auto attr = [&]() -> ::mlir::Attribute {
        return ::mlir::DenseI32ArrayAttr::get(ctx, propStorage);
      }();
      attrs.push_back(odsBuilder.getNamedAttr("operandSegmentSizes", attr));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code PackedTrunc2xFp8Op::computePropertiesHash(const Properties &prop) {
  auto hash_operandSegmentSizes = [] (const auto &propStorage) -> llvm::hash_code {
    using ::llvm::hash_value;
    return ::llvm::hash_combine_range(std::begin(propStorage), std::end(propStorage));;
  };
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.wordIndex.getAsOpaquePointer()), 
    hash_operandSegmentSizes(prop.operandSegmentSizes));
}

std::optional<mlir::Attribute> PackedTrunc2xFp8Op::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "wordIndex")
      return prop.wordIndex;
    if (name == "operand_segment_sizes" || name == "operandSegmentSizes") return [&]() -> ::mlir::Attribute { return ::mlir::DenseI32ArrayAttr::get(ctx, prop.operandSegmentSizes); }();
  return std::nullopt;
}

void PackedTrunc2xFp8Op::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "wordIndex") {
       prop.wordIndex = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.wordIndex)>>(value);
       return;
    }
        if (name == "operand_segment_sizes" || name == "operandSegmentSizes") {
       auto arrAttr = ::llvm::dyn_cast_or_null<::mlir::DenseI32ArrayAttr>(value);
       if (!arrAttr) return;
       if (arrAttr.size() != sizeof(prop.operandSegmentSizes) / sizeof(int32_t))
         return;
       llvm::copy(arrAttr.asArrayRef(), prop.operandSegmentSizes.begin());
       return;
    }
}

void PackedTrunc2xFp8Op::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.wordIndex) attrs.append("wordIndex", prop.wordIndex);
  attrs.append("operandSegmentSizes", [&]() -> ::mlir::Attribute { return ::mlir::DenseI32ArrayAttr::get(ctx, prop.operandSegmentSizes); }());
}

::llvm::LogicalResult PackedTrunc2xFp8Op::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getWordIndexAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU10(attr, "wordIndex", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult PackedTrunc2xFp8Op::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (reader.getBytecodeVersion() < /*kNativePropertiesODSSegmentSize=*/6) {
    auto &propStorage = prop.operandSegmentSizes;
    ::mlir::DenseI32ArrayAttr attr;
    if (::mlir::failed(reader.readAttribute(attr))) return ::mlir::failure();
    if (attr.size() > static_cast<int64_t>(sizeof(propStorage) / sizeof(int32_t))) {
      reader.emitError("size mismatch for operand/result_segment_size");
      return ::mlir::failure();
    }
    ::llvm::copy(::llvm::ArrayRef<int32_t>(attr), propStorage.begin());
  }

  if (::mlir::failed(reader.readAttribute(prop.wordIndex)))
    return ::mlir::failure();

  {
    auto &propStorage = prop.operandSegmentSizes;
    auto readProp = [&]() {

  if (reader.getBytecodeVersion() >= /*kNativePropertiesODSSegmentSize=*/6)
    return reader.readSparseArray(::llvm::MutableArrayRef(propStorage));
;
      return ::mlir::success();
    };
    if (::mlir::failed(readProp()))
      return ::mlir::failure();
  }
  return ::mlir::success();
}

void PackedTrunc2xFp8Op::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;

if (writer.getBytecodeVersion() < /*kNativePropertiesODSSegmentSize=*/6) {
  auto &propStorage = prop.operandSegmentSizes;
  writer.writeAttribute(::mlir::DenseI32ArrayAttr::get(this->getContext(), propStorage));
}
  writer.writeAttribute(prop.wordIndex);

  {
    auto &propStorage = prop.operandSegmentSizes;

  if (writer.getBytecodeVersion() >= /*kNativePropertiesODSSegmentSize=*/6)
    writer.writeSparseArray(::llvm::ArrayRef(propStorage));
;
  }
}

uint32_t PackedTrunc2xFp8Op::getWordIndex() {
  auto attr = getWordIndexAttr();
  return attr.getValue().getZExtValue();
}

void PackedTrunc2xFp8Op::setWordIndex(uint32_t attrValue) {
  getProperties().wordIndex = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void PackedTrunc2xFp8Op::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type res, ::mlir::Value sourceA, /*optional*/::mlir::Value sourceB, ::mlir::IntegerAttr wordIndex, /*optional*/::mlir::Value existing) {
  odsState.addOperands(sourceA);
  if (sourceB)
    odsState.addOperands(sourceB);
  if (existing)
    odsState.addOperands(existing);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, (sourceB ? 1 : 0), (existing ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().wordIndex = wordIndex;
  odsState.addTypes(res);
}

void PackedTrunc2xFp8Op::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value sourceA, /*optional*/::mlir::Value sourceB, ::mlir::IntegerAttr wordIndex, /*optional*/::mlir::Value existing) {
  odsState.addOperands(sourceA);
  if (sourceB)
    odsState.addOperands(sourceB);
  if (existing)
    odsState.addOperands(existing);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, (sourceB ? 1 : 0), (existing ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().wordIndex = wordIndex;
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void PackedTrunc2xFp8Op::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type res, ::mlir::Value sourceA, /*optional*/::mlir::Value sourceB, uint32_t wordIndex, /*optional*/::mlir::Value existing) {
  odsState.addOperands(sourceA);
  if (sourceB)
    odsState.addOperands(sourceB);
  if (existing)
    odsState.addOperands(existing);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, (sourceB ? 1 : 0), (existing ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().wordIndex = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), wordIndex);
  odsState.addTypes(res);
}

void PackedTrunc2xFp8Op::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value sourceA, /*optional*/::mlir::Value sourceB, uint32_t wordIndex, /*optional*/::mlir::Value existing) {
  odsState.addOperands(sourceA);
  if (sourceB)
    odsState.addOperands(sourceB);
  if (existing)
    odsState.addOperands(existing);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, (sourceB ? 1 : 0), (existing ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().wordIndex = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), wordIndex);
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void PackedTrunc2xFp8Op::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 1u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<PackedTrunc2xFp8Op::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void PackedTrunc2xFp8Op::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 1u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

::llvm::LogicalResult PackedTrunc2xFp8Op::verifyInvariantsImpl() {
  auto tblgen_wordIndex = getProperties().wordIndex; (void)tblgen_wordIndex;
  if (!tblgen_wordIndex) return emitOpError("requires attribute 'wordIndex'");

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU10(*this, tblgen_wordIndex, "wordIndex")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU11(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    if (valueGroup1.size() > 1) {
      return emitOpError("operand group starting at #") << index
          << " requires 0 or 1 element, but found " << valueGroup1.size();
    }

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU11(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup2 = getODSOperands(2);

    if (valueGroup2.size() > 1) {
      return emitOpError("operand group starting at #") << index
          << " requires 0 or 1 element, but found " << valueGroup2.size();
    }

    for (auto v : valueGroup2) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU13(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSResults(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU13(*this, v.getType(), "result", index++)))
        return ::mlir::failure();
    }
  }
  return ::mlir::success();
}

::llvm::LogicalResult PackedTrunc2xFp8Op::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::mlir::ParseResult PackedTrunc2xFp8Op::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand sourceARawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> sourceAOperands(&sourceARawOperand, 1);  ::llvm::SMLoc sourceAOperandsLoc;
  (void)sourceAOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> sourceBOperands;
  ::llvm::SMLoc sourceBOperandsLoc;
  (void)sourceBOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> existingOperands;
  ::llvm::SMLoc existingOperandsLoc;
  (void)existingOperandsLoc;
  ::mlir::IntegerAttr wordIndexAttr;
  ::mlir::Type sourceARawType{};
  ::llvm::ArrayRef<::mlir::Type> sourceATypes(&sourceARawType, 1);
  ::mlir::Type resRawType{};
  ::llvm::ArrayRef<::mlir::Type> resTypes(&resRawType, 1);
  ::llvm::SmallVector<::mlir::Type, 1> existingTypes;
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }

  sourceAOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(sourceARawOperand))
    return ::mlir::failure();
  if (parser.parseComma())
    return ::mlir::failure();

  {
    sourceBOperandsLoc = parser.getCurrentLocation();
    ::mlir::OpAsmParser::UnresolvedOperand operand;
    ::mlir::OptionalParseResult parseResult =
                                    parser.parseOptionalOperand(operand);
    if (parseResult.has_value()) {
      if (failed(*parseResult))
        return ::mlir::failure();
      sourceBOperands.push_back(operand);
    }
  }
  if (!sourceBOperands.empty()) {
  } else {
  if (parser.parseKeyword("undef"))
    return ::mlir::failure();
  }
  if (parser.parseKeyword("into"))
    return ::mlir::failure();

  {
    existingOperandsLoc = parser.getCurrentLocation();
    ::mlir::OpAsmParser::UnresolvedOperand operand;
    ::mlir::OptionalParseResult parseResult =
                                    parser.parseOptionalOperand(operand);
    if (parseResult.has_value()) {
      if (failed(*parseResult))
        return ::mlir::failure();
      existingOperands.push_back(operand);
    }
  }
  if (!existingOperands.empty()) {
  } else {
  if (parser.parseKeyword("undef"))
    return ::mlir::failure();
  }
  if (parser.parseLSquare())
    return ::mlir::failure();
  if (parser.parseKeyword("word"))
    return ::mlir::failure();

  if (parser.parseCustomAttributeWithFallback(wordIndexAttr, parser.getBuilder().getIntegerType(32))) {
    return ::mlir::failure();
  }
  if (wordIndexAttr) result.getOrAddProperties<PackedTrunc2xFp8Op::Properties>().wordIndex = wordIndexAttr;
  if (parser.parseRSquare())
    return ::mlir::failure();
  if (parser.parseColon())
    return ::mlir::failure();

  {
    ::mlir::FloatType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    sourceARawType = type;
  }
  if (parser.parseKeyword("to"))
    return ::mlir::failure();

  {
    ::mlir::VectorType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    resRawType = type;
  }
  if (::mlir::succeeded(parser.parseOptionalKeyword("into"))) {

  {
    ::mlir::Type optionalType;
    ::mlir::OptionalParseResult parseResult =
                                    parser.parseOptionalType(optionalType);
    if (parseResult.has_value()) {
      if (failed(*parseResult))
        return ::mlir::failure();
      existingTypes.push_back(optionalType);
    }
  }
  }
::llvm::copy(::llvm::ArrayRef<int32_t>({1, static_cast<int32_t>(sourceBOperands.size()), static_cast<int32_t>(existingOperands.size())}), result.getOrAddProperties<PackedTrunc2xFp8Op::Properties>().operandSegmentSizes.begin());
  ::mlir::Type odsBuildableType0 = parser.getBuilder().getF32Type();
  result.addTypes(resTypes);
  if (parser.resolveOperands(sourceAOperands, sourceATypes, sourceAOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(sourceBOperands, odsBuildableType0, sourceBOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(existingOperands, existingTypes, existingOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void PackedTrunc2xFp8Op::print(::mlir::OpAsmPrinter &_odsPrinter) {
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("operandSegmentSizes");
  elidedAttrs.push_back("wordIndex");
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ';
  _odsPrinter << getSourceA();
  _odsPrinter << ",";
  if (getSourceB()) {
    _odsPrinter << ' ';
    if (::mlir::Value value = getSourceB())
      _odsPrinter << value;
  } else {
    _odsPrinter << ' ' << "undef";
  }
  _odsPrinter << ' ' << "into";
  if (getExisting()) {
    _odsPrinter << ' ';
    if (::mlir::Value value = getExisting())
      _odsPrinter << value;
  } else {
    _odsPrinter << ' ' << "undef";
  }
  _odsPrinter << "[";
  _odsPrinter << "word";
  _odsPrinter << ' ';
  _odsPrinter.printAttributeWithoutType(getWordIndexAttr());
  _odsPrinter << "]";
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getSourceA().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::FloatType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ' ' << "to";
  _odsPrinter << ' ';
  {
    auto type = getRes().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::VectorType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  if (getExisting()) {
    _odsPrinter << ' ' << "into";
    _odsPrinter << ' ';
    _odsPrinter << (getExisting() ? ::llvm::ArrayRef<::mlir::Type>(getExisting().getType()) : ::llvm::ArrayRef<::mlir::Type>());
  }
}

void PackedTrunc2xFp8Op::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::PackedTrunc2xFp8Op)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::RawBufferAtomicCmpswapOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
RawBufferAtomicCmpswapOpGenericAdaptorBase::RawBufferAtomicCmpswapOpGenericAdaptorBase(RawBufferAtomicCmpswapOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

std::pair<unsigned, unsigned> RawBufferAtomicCmpswapOpGenericAdaptorBase::getODSOperandIndexAndLength(unsigned index, unsigned odsOperandsSize) {
  ::llvm::ArrayRef<int32_t> sizeAttr = getProperties().operandSegmentSizes;

  unsigned start = 0;
  for (unsigned i = 0; i < index; ++i)
    start += sizeAttr[i];
  return {start, sizeAttr[index]};
}

::mlir::BoolAttr RawBufferAtomicCmpswapOpGenericAdaptorBase::getBoundsCheckAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::BoolAttr>(getProperties().boundsCheck);
  return attr;
}

bool RawBufferAtomicCmpswapOpGenericAdaptorBase::getBoundsCheck() {
  auto attr = getBoundsCheckAttr();
  return attr.getValue();
}

::std::optional<uint32_t> RawBufferAtomicCmpswapOpGenericAdaptorBase::getIndexOffset() {
  auto attr = getIndexOffsetAttr();
  return attr ? ::std::optional<uint32_t>(attr.getValue().getZExtValue()) : (::std::nullopt);
}

} // namespace detail
RawBufferAtomicCmpswapOpAdaptor::RawBufferAtomicCmpswapOpAdaptor(RawBufferAtomicCmpswapOp op) : RawBufferAtomicCmpswapOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult RawBufferAtomicCmpswapOpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_boundsCheck = getProperties().boundsCheck; (void)tblgen_boundsCheck;
  auto tblgen_indexOffset = getProperties().indexOffset; (void)tblgen_indexOffset;

  if (tblgen_boundsCheck && !((::llvm::isa<::mlir::BoolAttr>(tblgen_boundsCheck))))
    return emitError(loc, "'amdgpu.raw_buffer_atomic_cmpswap' op ""attribute 'boundsCheck' failed to satisfy constraint: bool attribute");

  if (tblgen_indexOffset && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_indexOffset))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_indexOffset).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.raw_buffer_atomic_cmpswap' op ""attribute 'indexOffset' failed to satisfy constraint: 32-bit signless integer attribute");
  return ::mlir::success();
}

std::pair<unsigned, unsigned> RawBufferAtomicCmpswapOp::getODSOperandIndexAndLength(unsigned index) {
  ::llvm::ArrayRef<int32_t> sizeAttr = getProperties().operandSegmentSizes;

  unsigned start = 0;
  for (unsigned i = 0; i < index; ++i)
    start += sizeAttr[i];
  return {start, sizeAttr[index]};
}

::mlir::MutableOperandRange RawBufferAtomicCmpswapOp::getIndicesMutable() {
  auto range = getODSOperandIndexAndLength(3);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second, ::mlir::MutableOperandRange::OperandSegment(3u, {getOperandSegmentSizesAttrName(), ::mlir::DenseI32ArrayAttr::get(getContext(), getProperties().operandSegmentSizes)}));
  return mutableRange;
}

::mlir::MutableOperandRange RawBufferAtomicCmpswapOp::getSgprOffsetMutable() {
  auto range = getODSOperandIndexAndLength(4);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second, ::mlir::MutableOperandRange::OperandSegment(4u, {getOperandSegmentSizesAttrName(), ::mlir::DenseI32ArrayAttr::get(getContext(), getProperties().operandSegmentSizes)}));
  return mutableRange;
}

::llvm::LogicalResult RawBufferAtomicCmpswapOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.boundsCheck;
       auto attr = dict.get("boundsCheck");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `boundsCheck` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.indexOffset;
       auto attr = dict.get("indexOffset");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `indexOffset` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
{

      auto setFromAttr = [] (auto &propStorage, ::mlir::Attribute propAttr,
               ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) -> ::mlir::LogicalResult {
        return convertFromAttribute(propStorage, propAttr, emitError);
      };
         auto attr = dict.get("operandSegmentSizes");   if (!attr) attr = dict.get("operand_segment_sizes");;
;
      if (attr && ::mlir::failed(setFromAttr(prop.operandSegmentSizes, attr, emitError)))
        return ::mlir::failure();
  }
  return ::mlir::success();
}

::mlir::Attribute RawBufferAtomicCmpswapOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.boundsCheck;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("boundsCheck",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.indexOffset;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("indexOffset",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.operandSegmentSizes;
      auto attr = [&]() -> ::mlir::Attribute {
        return ::mlir::DenseI32ArrayAttr::get(ctx, propStorage);
      }();
      attrs.push_back(odsBuilder.getNamedAttr("operandSegmentSizes", attr));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code RawBufferAtomicCmpswapOp::computePropertiesHash(const Properties &prop) {
  auto hash_operandSegmentSizes = [] (const auto &propStorage) -> llvm::hash_code {
    using ::llvm::hash_value;
    return ::llvm::hash_combine_range(std::begin(propStorage), std::end(propStorage));;
  };
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.boundsCheck.getAsOpaquePointer()), 
    llvm::hash_value(prop.indexOffset.getAsOpaquePointer()), 
    hash_operandSegmentSizes(prop.operandSegmentSizes));
}

std::optional<mlir::Attribute> RawBufferAtomicCmpswapOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "boundsCheck")
      return prop.boundsCheck;

    if (name == "indexOffset")
      return prop.indexOffset;
    if (name == "operand_segment_sizes" || name == "operandSegmentSizes") return [&]() -> ::mlir::Attribute { return ::mlir::DenseI32ArrayAttr::get(ctx, prop.operandSegmentSizes); }();
  return std::nullopt;
}

void RawBufferAtomicCmpswapOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "boundsCheck") {
       prop.boundsCheck = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.boundsCheck)>>(value);
       return;
    }

    if (name == "indexOffset") {
       prop.indexOffset = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.indexOffset)>>(value);
       return;
    }
        if (name == "operand_segment_sizes" || name == "operandSegmentSizes") {
       auto arrAttr = ::llvm::dyn_cast_or_null<::mlir::DenseI32ArrayAttr>(value);
       if (!arrAttr) return;
       if (arrAttr.size() != sizeof(prop.operandSegmentSizes) / sizeof(int32_t))
         return;
       llvm::copy(arrAttr.asArrayRef(), prop.operandSegmentSizes.begin());
       return;
    }
}

void RawBufferAtomicCmpswapOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.boundsCheck) attrs.append("boundsCheck", prop.boundsCheck);

    if (prop.indexOffset) attrs.append("indexOffset", prop.indexOffset);
  attrs.append("operandSegmentSizes", [&]() -> ::mlir::Attribute { return ::mlir::DenseI32ArrayAttr::get(ctx, prop.operandSegmentSizes); }());
}

::llvm::LogicalResult RawBufferAtomicCmpswapOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getBoundsCheckAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU4(attr, "boundsCheck", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getIndexOffsetAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "indexOffset", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult RawBufferAtomicCmpswapOp::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readOptionalAttribute(prop.boundsCheck)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.indexOffset)))
    return ::mlir::failure();

  if (reader.getBytecodeVersion() < /*kNativePropertiesODSSegmentSize=*/6) {
    auto &propStorage = prop.operandSegmentSizes;
    ::mlir::DenseI32ArrayAttr attr;
    if (::mlir::failed(reader.readAttribute(attr))) return ::mlir::failure();
    if (attr.size() > static_cast<int64_t>(sizeof(propStorage) / sizeof(int32_t))) {
      reader.emitError("size mismatch for operand/result_segment_size");
      return ::mlir::failure();
    }
    ::llvm::copy(::llvm::ArrayRef<int32_t>(attr), propStorage.begin());
  }

  {
    auto &propStorage = prop.operandSegmentSizes;
    auto readProp = [&]() {

  if (reader.getBytecodeVersion() >= /*kNativePropertiesODSSegmentSize=*/6)
    return reader.readSparseArray(::llvm::MutableArrayRef(propStorage));
;
      return ::mlir::success();
    };
    if (::mlir::failed(readProp()))
      return ::mlir::failure();
  }
  return ::mlir::success();
}

void RawBufferAtomicCmpswapOp::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;

  writer.writeOptionalAttribute(prop.boundsCheck);

  writer.writeOptionalAttribute(prop.indexOffset);

if (writer.getBytecodeVersion() < /*kNativePropertiesODSSegmentSize=*/6) {
  auto &propStorage = prop.operandSegmentSizes;
  writer.writeAttribute(::mlir::DenseI32ArrayAttr::get(this->getContext(), propStorage));
}

  {
    auto &propStorage = prop.operandSegmentSizes;

  if (writer.getBytecodeVersion() >= /*kNativePropertiesODSSegmentSize=*/6)
    writer.writeSparseArray(::llvm::ArrayRef(propStorage));
;
  }
}

bool RawBufferAtomicCmpswapOp::getBoundsCheck() {
  auto attr = getBoundsCheckAttr();
  return attr.getValue();
}

::std::optional<uint32_t> RawBufferAtomicCmpswapOp::getIndexOffset() {
  auto attr = getIndexOffsetAttr();
  return attr ? ::std::optional<uint32_t>(attr.getValue().getZExtValue()) : (::std::nullopt);
}

void RawBufferAtomicCmpswapOp::setBoundsCheck(bool attrValue) {
  getProperties().boundsCheck = ::mlir::Builder((*this)->getContext()).getBoolAttr(attrValue);
}

void RawBufferAtomicCmpswapOp::setIndexOffset(::std::optional<uint32_t> attrValue) {
    auto &odsProp = getProperties().indexOffset;
    if (attrValue)
      odsProp = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), *attrValue);
    else
      odsProp = nullptr;
}

void RawBufferAtomicCmpswapOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type value, ::mlir::Value src, ::mlir::Value cmp, ::mlir::Value memref, ::mlir::ValueRange indices, ::mlir::BoolAttr boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(src);
  odsState.addOperands(cmp);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  if (boundsCheck) {
    odsState.getOrAddProperties<Properties>().boundsCheck = boundsCheck;
  }
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
  odsState.addTypes(value);
}

void RawBufferAtomicCmpswapOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value src, ::mlir::Value cmp, ::mlir::Value memref, ::mlir::ValueRange indices, ::mlir::BoolAttr boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(src);
  odsState.addOperands(cmp);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  if (boundsCheck) {
    odsState.getOrAddProperties<Properties>().boundsCheck = boundsCheck;
  }
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }

        ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
        if (::mlir::succeeded(RawBufferAtomicCmpswapOp::inferReturnTypes(odsBuilder.getContext(),
                      odsState.location, odsState.operands,
                      odsState.attributes.getDictionary(odsState.getContext()),
                      odsState.getRawProperties(),
                      odsState.regions, inferredReturnTypes)))
          odsState.addTypes(inferredReturnTypes);
        else
          ::mlir::detail::reportFatalInferReturnTypesError(odsState);
        
}

void RawBufferAtomicCmpswapOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value src, ::mlir::Value cmp, ::mlir::Value memref, ::mlir::ValueRange indices, ::mlir::BoolAttr boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(src);
  odsState.addOperands(cmp);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  if (boundsCheck) {
    odsState.getOrAddProperties<Properties>().boundsCheck = boundsCheck;
  }
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void RawBufferAtomicCmpswapOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type value, ::mlir::Value src, ::mlir::Value cmp, ::mlir::Value memref, ::mlir::ValueRange indices, bool boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(src);
  odsState.addOperands(cmp);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().boundsCheck = odsBuilder.getBoolAttr(boundsCheck);
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
  odsState.addTypes(value);
}

void RawBufferAtomicCmpswapOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value src, ::mlir::Value cmp, ::mlir::Value memref, ::mlir::ValueRange indices, bool boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(src);
  odsState.addOperands(cmp);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().boundsCheck = odsBuilder.getBoolAttr(boundsCheck);
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }

        ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
        if (::mlir::succeeded(RawBufferAtomicCmpswapOp::inferReturnTypes(odsBuilder.getContext(),
                      odsState.location, odsState.operands,
                      odsState.attributes.getDictionary(odsState.getContext()),
                      odsState.getRawProperties(),
                      odsState.regions, inferredReturnTypes)))
          odsState.addTypes(inferredReturnTypes);
        else
          ::mlir::detail::reportFatalInferReturnTypesError(odsState);
        
}

void RawBufferAtomicCmpswapOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value src, ::mlir::Value cmp, ::mlir::Value memref, ::mlir::ValueRange indices, bool boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(src);
  odsState.addOperands(cmp);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().boundsCheck = odsBuilder.getBoolAttr(boundsCheck);
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void RawBufferAtomicCmpswapOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 3u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<RawBufferAtomicCmpswapOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void RawBufferAtomicCmpswapOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 3u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<RawBufferAtomicCmpswapOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
  ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
  if (::mlir::succeeded(RawBufferAtomicCmpswapOp::inferReturnTypes(odsBuilder.getContext(),
          odsState.location, operands,
          odsState.attributes.getDictionary(odsState.getContext()),
          odsState.getRawProperties(),
          odsState.regions, inferredReturnTypes))) {
    assert(inferredReturnTypes.size() == 1u && "mismatched number of return types");
    odsState.addTypes(inferredReturnTypes);
  } else {
    ::llvm::report_fatal_error("Failed to infer result type(s).");
  }
}

void RawBufferAtomicCmpswapOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 3u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void RawBufferAtomicCmpswapOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 3u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties &>(properties));
  odsState.addAttributes(discardableAttributes);

  ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
  if (::mlir::succeeded(RawBufferAtomicCmpswapOp::inferReturnTypes(odsBuilder.getContext(),
          odsState.location, operands,
          odsState.attributes.getDictionary(odsState.getContext()),
          odsState.getRawProperties(),
          odsState.regions, inferredReturnTypes))) {
    assert(inferredReturnTypes.size() == 1u && "mismatched number of return types");
    odsState.addTypes(inferredReturnTypes);
  } else {
    ::llvm::report_fatal_error("Failed to infer result type(s).");
  }
}

void RawBufferAtomicCmpswapOp::populateDefaultProperties(::mlir::OperationName opName, Properties &properties) {
  ::mlir::Builder odsBuilder(opName.getContext());
  if (!properties.boundsCheck)
    properties.boundsCheck = odsBuilder.getBoolAttr(true);
}

::llvm::LogicalResult RawBufferAtomicCmpswapOp::verifyInvariantsImpl() {
  auto tblgen_boundsCheck = getProperties().boundsCheck; (void)tblgen_boundsCheck;
  auto tblgen_indexOffset = getProperties().indexOffset; (void)tblgen_indexOffset;

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU4(*this, tblgen_boundsCheck, "boundsCheck")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_indexOffset, "indexOffset")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU1(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU1(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup2 = getODSOperands(2);

    for (auto v : valueGroup2) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU4(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup3 = getODSOperands(3);

    for (auto v : valueGroup3) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU14(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup4 = getODSOperands(4);

    if (valueGroup4.size() > 1) {
      return emitOpError("operand group starting at #") << index
          << " requires 0 or 1 element, but found " << valueGroup4.size();
    }

    for (auto v : valueGroup4) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU5(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSResults(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU1(*this, v.getType(), "result", index++)))
        return ::mlir::failure();
    }
  }
  if (!((((*this->getODSOperands(0).begin()).getType()) == ((*this->getODSOperands(1).begin()).getType()) && ((*this->getODSOperands(1).begin()).getType()) == ((*this->getODSResults(0).begin()).getType()) && ((*this->getODSResults(0).begin()).getType()) == ((*this->getODSOperands(0).begin()).getType()))))
    return emitOpError("failed to verify that all of {src, cmp, value} have same type");
  if (!(((getElementTypeOrSelf((*this->getODSResults(0).begin()))) == (getElementTypeOrSelf((*this->getODSOperands(2).begin()))) && (getElementTypeOrSelf((*this->getODSOperands(2).begin()))) == (getElementTypeOrSelf((*this->getODSResults(0).begin()))))))
    return emitOpError("failed to verify that all of {value, memref} have same element type");
  return ::mlir::success();
}

::llvm::LogicalResult RawBufferAtomicCmpswapOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::llvm::LogicalResult RawBufferAtomicCmpswapOp::inferReturnTypes(::mlir::MLIRContext *context, ::std::optional<::mlir::Location> location, ::mlir::ValueRange operands, ::mlir::DictionaryAttr attributes, ::mlir::OpaqueProperties properties, ::mlir::RegionRange regions, ::llvm::SmallVectorImpl<::mlir::Type>&inferredReturnTypes) {
  inferredReturnTypes.resize(1);
  ::mlir::Builder odsBuilder(context);
  if (operands.size() <= 1)
    return ::mlir::failure();
  ::mlir::Type odsInferredType0 = operands[1].getType();
  inferredReturnTypes[0] = odsInferredType0;
  return ::mlir::success();
}

::mlir::ParseResult RawBufferAtomicCmpswapOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand srcRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> srcOperands(&srcRawOperand, 1);  ::llvm::SMLoc srcOperandsLoc;
  (void)srcOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand cmpRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> cmpOperands(&cmpRawOperand, 1);  ::llvm::SMLoc cmpOperandsLoc;
  (void)cmpOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand memrefRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> memrefOperands(&memrefRawOperand, 1);  ::llvm::SMLoc memrefOperandsLoc;
  (void)memrefOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> indicesOperands;
  ::llvm::SMLoc indicesOperandsLoc;
  (void)indicesOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> sgprOffsetOperands;
  ::llvm::SMLoc sgprOffsetOperandsLoc;
  (void)sgprOffsetOperandsLoc;
  ::mlir::Type valueRawType{};
  ::llvm::ArrayRef<::mlir::Type> valueTypes(&valueRawType, 1);
  ::mlir::Type memrefRawType{};
  ::llvm::ArrayRef<::mlir::Type> memrefTypes(&memrefRawType, 1);
  ::llvm::SmallVector<::mlir::Type, 1> indicesTypes;
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }

  srcOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(srcRawOperand))
    return ::mlir::failure();
  if (parser.parseComma())
    return ::mlir::failure();

  cmpOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(cmpRawOperand))
    return ::mlir::failure();
  if (parser.parseArrow())
    return ::mlir::failure();

  memrefOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(memrefRawOperand))
    return ::mlir::failure();
  if (parser.parseLSquare())
    return ::mlir::failure();

  indicesOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperandList(indicesOperands))
    return ::mlir::failure();
  if (parser.parseRSquare())
    return ::mlir::failure();
  if (::mlir::succeeded(parser.parseOptionalKeyword("sgprOffset"))) {

  {
    sgprOffsetOperandsLoc = parser.getCurrentLocation();
    ::mlir::OpAsmParser::UnresolvedOperand operand;
    ::mlir::OptionalParseResult parseResult =
                                    parser.parseOptionalOperand(operand);
    if (parseResult.has_value()) {
      if (failed(*parseResult))
        return ::mlir::failure();
      sgprOffsetOperands.push_back(operand);
    }
  }
  }
  if (parser.parseColon())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    valueRawType = type;
  }
  if (parser.parseArrow())
    return ::mlir::failure();

  {
    ::mlir::MemRefType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    memrefRawType = type;
  }
  if (parser.parseComma())
    return ::mlir::failure();

  if (parser.parseTypeList(indicesTypes))
    return ::mlir::failure();
::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, 1, static_cast<int32_t>(indicesOperands.size()), static_cast<int32_t>(sgprOffsetOperands.size())}), result.getOrAddProperties<RawBufferAtomicCmpswapOp::Properties>().operandSegmentSizes.begin());
  ::mlir::Type odsBuildableType0 = parser.getBuilder().getIntegerType(32);
  result.addTypes(valueTypes);
  if (parser.resolveOperands(srcOperands, valueTypes[0], srcOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(cmpOperands, valueTypes[0], cmpOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(memrefOperands, memrefTypes, memrefOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(indicesOperands, indicesTypes, indicesOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(sgprOffsetOperands, odsBuildableType0, sgprOffsetOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void RawBufferAtomicCmpswapOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("operandSegmentSizes");
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getBoundsCheckAttr();
     if(attr && (attr == odsBuilder.getBoolAttr(true)))
       elidedAttrs.push_back("boundsCheck");
  }
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ';
  _odsPrinter << getSrc();
  _odsPrinter << ",";
  _odsPrinter << ' ';
  _odsPrinter << getCmp();
  _odsPrinter << ' ' << "->";
  _odsPrinter << ' ';
  _odsPrinter << getMemref();
  _odsPrinter << "[";
  _odsPrinter << getIndices();
  _odsPrinter << "]";
  if (getSgprOffset()) {
    _odsPrinter << ' ' << "sgprOffset";
    _odsPrinter << ' ';
    if (::mlir::Value value = getSgprOffset())
      _odsPrinter << value;
  }
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getValue().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ' ' << "->";
  _odsPrinter << ' ';
  {
    auto type = getMemref().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::MemRefType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ",";
  _odsPrinter << ' ';
  _odsPrinter << getIndices().getTypes();
}

void RawBufferAtomicCmpswapOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
  {
    auto valueRange = getODSOperandIndexAndLength(2);
    for (unsigned idx = valueRange.first; idx < valueRange.first + valueRange.second; idx++) {
      effects.emplace_back(::mlir::MemoryEffects::Read::get(), &getOperation()->getOpOperand(idx), 0, false, ::mlir::SideEffects::DefaultResource::get());
    }
  }
  {
    auto valueRange = getODSOperandIndexAndLength(2);
    for (unsigned idx = valueRange.first; idx < valueRange.first + valueRange.second; idx++) {
      effects.emplace_back(::mlir::MemoryEffects::Write::get(), &getOperation()->getOpOperand(idx), 0, false, ::mlir::SideEffects::DefaultResource::get());
    }
  }
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::RawBufferAtomicCmpswapOp)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::RawBufferAtomicFaddOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
RawBufferAtomicFaddOpGenericAdaptorBase::RawBufferAtomicFaddOpGenericAdaptorBase(RawBufferAtomicFaddOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

std::pair<unsigned, unsigned> RawBufferAtomicFaddOpGenericAdaptorBase::getODSOperandIndexAndLength(unsigned index, unsigned odsOperandsSize) {
  ::llvm::ArrayRef<int32_t> sizeAttr = getProperties().operandSegmentSizes;

  unsigned start = 0;
  for (unsigned i = 0; i < index; ++i)
    start += sizeAttr[i];
  return {start, sizeAttr[index]};
}

::mlir::BoolAttr RawBufferAtomicFaddOpGenericAdaptorBase::getBoundsCheckAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::BoolAttr>(getProperties().boundsCheck);
  return attr;
}

bool RawBufferAtomicFaddOpGenericAdaptorBase::getBoundsCheck() {
  auto attr = getBoundsCheckAttr();
  return attr.getValue();
}

::std::optional<uint32_t> RawBufferAtomicFaddOpGenericAdaptorBase::getIndexOffset() {
  auto attr = getIndexOffsetAttr();
  return attr ? ::std::optional<uint32_t>(attr.getValue().getZExtValue()) : (::std::nullopt);
}

} // namespace detail
RawBufferAtomicFaddOpAdaptor::RawBufferAtomicFaddOpAdaptor(RawBufferAtomicFaddOp op) : RawBufferAtomicFaddOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult RawBufferAtomicFaddOpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_boundsCheck = getProperties().boundsCheck; (void)tblgen_boundsCheck;
  auto tblgen_indexOffset = getProperties().indexOffset; (void)tblgen_indexOffset;

  if (tblgen_boundsCheck && !((::llvm::isa<::mlir::BoolAttr>(tblgen_boundsCheck))))
    return emitError(loc, "'amdgpu.raw_buffer_atomic_fadd' op ""attribute 'boundsCheck' failed to satisfy constraint: bool attribute");

  if (tblgen_indexOffset && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_indexOffset))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_indexOffset).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.raw_buffer_atomic_fadd' op ""attribute 'indexOffset' failed to satisfy constraint: 32-bit signless integer attribute");
  return ::mlir::success();
}

std::pair<unsigned, unsigned> RawBufferAtomicFaddOp::getODSOperandIndexAndLength(unsigned index) {
  ::llvm::ArrayRef<int32_t> sizeAttr = getProperties().operandSegmentSizes;

  unsigned start = 0;
  for (unsigned i = 0; i < index; ++i)
    start += sizeAttr[i];
  return {start, sizeAttr[index]};
}

::mlir::MutableOperandRange RawBufferAtomicFaddOp::getIndicesMutable() {
  auto range = getODSOperandIndexAndLength(2);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second, ::mlir::MutableOperandRange::OperandSegment(2u, {getOperandSegmentSizesAttrName(), ::mlir::DenseI32ArrayAttr::get(getContext(), getProperties().operandSegmentSizes)}));
  return mutableRange;
}

::mlir::MutableOperandRange RawBufferAtomicFaddOp::getSgprOffsetMutable() {
  auto range = getODSOperandIndexAndLength(3);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second, ::mlir::MutableOperandRange::OperandSegment(3u, {getOperandSegmentSizesAttrName(), ::mlir::DenseI32ArrayAttr::get(getContext(), getProperties().operandSegmentSizes)}));
  return mutableRange;
}

::llvm::LogicalResult RawBufferAtomicFaddOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.boundsCheck;
       auto attr = dict.get("boundsCheck");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `boundsCheck` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.indexOffset;
       auto attr = dict.get("indexOffset");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `indexOffset` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
{

      auto setFromAttr = [] (auto &propStorage, ::mlir::Attribute propAttr,
               ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) -> ::mlir::LogicalResult {
        return convertFromAttribute(propStorage, propAttr, emitError);
      };
         auto attr = dict.get("operandSegmentSizes");   if (!attr) attr = dict.get("operand_segment_sizes");;
;
      if (attr && ::mlir::failed(setFromAttr(prop.operandSegmentSizes, attr, emitError)))
        return ::mlir::failure();
  }
  return ::mlir::success();
}

::mlir::Attribute RawBufferAtomicFaddOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.boundsCheck;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("boundsCheck",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.indexOffset;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("indexOffset",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.operandSegmentSizes;
      auto attr = [&]() -> ::mlir::Attribute {
        return ::mlir::DenseI32ArrayAttr::get(ctx, propStorage);
      }();
      attrs.push_back(odsBuilder.getNamedAttr("operandSegmentSizes", attr));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code RawBufferAtomicFaddOp::computePropertiesHash(const Properties &prop) {
  auto hash_operandSegmentSizes = [] (const auto &propStorage) -> llvm::hash_code {
    using ::llvm::hash_value;
    return ::llvm::hash_combine_range(std::begin(propStorage), std::end(propStorage));;
  };
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.boundsCheck.getAsOpaquePointer()), 
    llvm::hash_value(prop.indexOffset.getAsOpaquePointer()), 
    hash_operandSegmentSizes(prop.operandSegmentSizes));
}

std::optional<mlir::Attribute> RawBufferAtomicFaddOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "boundsCheck")
      return prop.boundsCheck;

    if (name == "indexOffset")
      return prop.indexOffset;
    if (name == "operand_segment_sizes" || name == "operandSegmentSizes") return [&]() -> ::mlir::Attribute { return ::mlir::DenseI32ArrayAttr::get(ctx, prop.operandSegmentSizes); }();
  return std::nullopt;
}

void RawBufferAtomicFaddOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "boundsCheck") {
       prop.boundsCheck = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.boundsCheck)>>(value);
       return;
    }

    if (name == "indexOffset") {
       prop.indexOffset = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.indexOffset)>>(value);
       return;
    }
        if (name == "operand_segment_sizes" || name == "operandSegmentSizes") {
       auto arrAttr = ::llvm::dyn_cast_or_null<::mlir::DenseI32ArrayAttr>(value);
       if (!arrAttr) return;
       if (arrAttr.size() != sizeof(prop.operandSegmentSizes) / sizeof(int32_t))
         return;
       llvm::copy(arrAttr.asArrayRef(), prop.operandSegmentSizes.begin());
       return;
    }
}

void RawBufferAtomicFaddOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.boundsCheck) attrs.append("boundsCheck", prop.boundsCheck);

    if (prop.indexOffset) attrs.append("indexOffset", prop.indexOffset);
  attrs.append("operandSegmentSizes", [&]() -> ::mlir::Attribute { return ::mlir::DenseI32ArrayAttr::get(ctx, prop.operandSegmentSizes); }());
}

::llvm::LogicalResult RawBufferAtomicFaddOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getBoundsCheckAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU4(attr, "boundsCheck", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getIndexOffsetAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "indexOffset", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult RawBufferAtomicFaddOp::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readOptionalAttribute(prop.boundsCheck)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.indexOffset)))
    return ::mlir::failure();

  if (reader.getBytecodeVersion() < /*kNativePropertiesODSSegmentSize=*/6) {
    auto &propStorage = prop.operandSegmentSizes;
    ::mlir::DenseI32ArrayAttr attr;
    if (::mlir::failed(reader.readAttribute(attr))) return ::mlir::failure();
    if (attr.size() > static_cast<int64_t>(sizeof(propStorage) / sizeof(int32_t))) {
      reader.emitError("size mismatch for operand/result_segment_size");
      return ::mlir::failure();
    }
    ::llvm::copy(::llvm::ArrayRef<int32_t>(attr), propStorage.begin());
  }

  {
    auto &propStorage = prop.operandSegmentSizes;
    auto readProp = [&]() {

  if (reader.getBytecodeVersion() >= /*kNativePropertiesODSSegmentSize=*/6)
    return reader.readSparseArray(::llvm::MutableArrayRef(propStorage));
;
      return ::mlir::success();
    };
    if (::mlir::failed(readProp()))
      return ::mlir::failure();
  }
  return ::mlir::success();
}

void RawBufferAtomicFaddOp::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;

  writer.writeOptionalAttribute(prop.boundsCheck);

  writer.writeOptionalAttribute(prop.indexOffset);

if (writer.getBytecodeVersion() < /*kNativePropertiesODSSegmentSize=*/6) {
  auto &propStorage = prop.operandSegmentSizes;
  writer.writeAttribute(::mlir::DenseI32ArrayAttr::get(this->getContext(), propStorage));
}

  {
    auto &propStorage = prop.operandSegmentSizes;

  if (writer.getBytecodeVersion() >= /*kNativePropertiesODSSegmentSize=*/6)
    writer.writeSparseArray(::llvm::ArrayRef(propStorage));
;
  }
}

bool RawBufferAtomicFaddOp::getBoundsCheck() {
  auto attr = getBoundsCheckAttr();
  return attr.getValue();
}

::std::optional<uint32_t> RawBufferAtomicFaddOp::getIndexOffset() {
  auto attr = getIndexOffsetAttr();
  return attr ? ::std::optional<uint32_t>(attr.getValue().getZExtValue()) : (::std::nullopt);
}

void RawBufferAtomicFaddOp::setBoundsCheck(bool attrValue) {
  getProperties().boundsCheck = ::mlir::Builder((*this)->getContext()).getBoolAttr(attrValue);
}

void RawBufferAtomicFaddOp::setIndexOffset(::std::optional<uint32_t> attrValue) {
    auto &odsProp = getProperties().indexOffset;
    if (attrValue)
      odsProp = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), *attrValue);
    else
      odsProp = nullptr;
}

void RawBufferAtomicFaddOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value value, ::mlir::Value memref, ::mlir::ValueRange indices, ::mlir::BoolAttr boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(value);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  if (boundsCheck) {
    odsState.getOrAddProperties<Properties>().boundsCheck = boundsCheck;
  }
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
}

void RawBufferAtomicFaddOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value value, ::mlir::Value memref, ::mlir::ValueRange indices, ::mlir::BoolAttr boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(value);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  if (boundsCheck) {
    odsState.getOrAddProperties<Properties>().boundsCheck = boundsCheck;
  }
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
  assert(resultTypes.size() == 0u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void RawBufferAtomicFaddOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value value, ::mlir::Value memref, ::mlir::ValueRange indices, bool boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(value);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().boundsCheck = odsBuilder.getBoolAttr(boundsCheck);
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
}

void RawBufferAtomicFaddOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value value, ::mlir::Value memref, ::mlir::ValueRange indices, bool boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(value);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().boundsCheck = odsBuilder.getBoolAttr(boundsCheck);
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
  assert(resultTypes.size() == 0u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void RawBufferAtomicFaddOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 0u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<RawBufferAtomicFaddOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void RawBufferAtomicFaddOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 0u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void RawBufferAtomicFaddOp::populateDefaultProperties(::mlir::OperationName opName, Properties &properties) {
  ::mlir::Builder odsBuilder(opName.getContext());
  if (!properties.boundsCheck)
    properties.boundsCheck = odsBuilder.getBoolAttr(true);
}

::llvm::LogicalResult RawBufferAtomicFaddOp::verifyInvariantsImpl() {
  auto tblgen_boundsCheck = getProperties().boundsCheck; (void)tblgen_boundsCheck;
  auto tblgen_indexOffset = getProperties().indexOffset; (void)tblgen_indexOffset;

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU4(*this, tblgen_boundsCheck, "boundsCheck")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_indexOffset, "indexOffset")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU15(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU4(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup2 = getODSOperands(2);

    for (auto v : valueGroup2) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU14(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup3 = getODSOperands(3);

    if (valueGroup3.size() > 1) {
      return emitOpError("operand group starting at #") << index
          << " requires 0 or 1 element, but found " << valueGroup3.size();
    }

    for (auto v : valueGroup3) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU5(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  if (!(((getElementTypeOrSelf((*this->getODSOperands(0).begin()))) == (getElementTypeOrSelf((*this->getODSOperands(1).begin()))) && (getElementTypeOrSelf((*this->getODSOperands(1).begin()))) == (getElementTypeOrSelf((*this->getODSOperands(0).begin()))))))
    return emitOpError("failed to verify that all of {value, memref} have same element type");
  return ::mlir::success();
}

::llvm::LogicalResult RawBufferAtomicFaddOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::mlir::ParseResult RawBufferAtomicFaddOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand valueRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> valueOperands(&valueRawOperand, 1);  ::llvm::SMLoc valueOperandsLoc;
  (void)valueOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand memrefRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> memrefOperands(&memrefRawOperand, 1);  ::llvm::SMLoc memrefOperandsLoc;
  (void)memrefOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> indicesOperands;
  ::llvm::SMLoc indicesOperandsLoc;
  (void)indicesOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> sgprOffsetOperands;
  ::llvm::SMLoc sgprOffsetOperandsLoc;
  (void)sgprOffsetOperandsLoc;
  ::mlir::Type valueRawType{};
  ::llvm::ArrayRef<::mlir::Type> valueTypes(&valueRawType, 1);
  ::mlir::Type memrefRawType{};
  ::llvm::ArrayRef<::mlir::Type> memrefTypes(&memrefRawType, 1);
  ::llvm::SmallVector<::mlir::Type, 1> indicesTypes;
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }

  valueOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(valueRawOperand))
    return ::mlir::failure();
  if (parser.parseArrow())
    return ::mlir::failure();

  memrefOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(memrefRawOperand))
    return ::mlir::failure();
  if (parser.parseLSquare())
    return ::mlir::failure();

  indicesOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperandList(indicesOperands))
    return ::mlir::failure();
  if (parser.parseRSquare())
    return ::mlir::failure();
  if (::mlir::succeeded(parser.parseOptionalKeyword("sgprOffset"))) {

  {
    sgprOffsetOperandsLoc = parser.getCurrentLocation();
    ::mlir::OpAsmParser::UnresolvedOperand operand;
    ::mlir::OptionalParseResult parseResult =
                                    parser.parseOptionalOperand(operand);
    if (parseResult.has_value()) {
      if (failed(*parseResult))
        return ::mlir::failure();
      sgprOffsetOperands.push_back(operand);
    }
  }
  }
  if (parser.parseColon())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    valueRawType = type;
  }
  if (parser.parseArrow())
    return ::mlir::failure();

  {
    ::mlir::MemRefType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    memrefRawType = type;
  }
  if (parser.parseComma())
    return ::mlir::failure();

  if (parser.parseTypeList(indicesTypes))
    return ::mlir::failure();
::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indicesOperands.size()), static_cast<int32_t>(sgprOffsetOperands.size())}), result.getOrAddProperties<RawBufferAtomicFaddOp::Properties>().operandSegmentSizes.begin());
  ::mlir::Type odsBuildableType0 = parser.getBuilder().getIntegerType(32);
  if (parser.resolveOperands(valueOperands, valueTypes, valueOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(memrefOperands, memrefTypes, memrefOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(indicesOperands, indicesTypes, indicesOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(sgprOffsetOperands, odsBuildableType0, sgprOffsetOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void RawBufferAtomicFaddOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("operandSegmentSizes");
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getBoundsCheckAttr();
     if(attr && (attr == odsBuilder.getBoolAttr(true)))
       elidedAttrs.push_back("boundsCheck");
  }
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ';
  _odsPrinter << getValue();
  _odsPrinter << ' ' << "->";
  _odsPrinter << ' ';
  _odsPrinter << getMemref();
  _odsPrinter << "[";
  _odsPrinter << getIndices();
  _odsPrinter << "]";
  if (getSgprOffset()) {
    _odsPrinter << ' ' << "sgprOffset";
    _odsPrinter << ' ';
    if (::mlir::Value value = getSgprOffset())
      _odsPrinter << value;
  }
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getValue().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ' ' << "->";
  _odsPrinter << ' ';
  {
    auto type = getMemref().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::MemRefType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ",";
  _odsPrinter << ' ';
  _odsPrinter << getIndices().getTypes();
}

void RawBufferAtomicFaddOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
  {
    auto valueRange = getODSOperandIndexAndLength(1);
    for (unsigned idx = valueRange.first; idx < valueRange.first + valueRange.second; idx++) {
      effects.emplace_back(::mlir::MemoryEffects::Read::get(), &getOperation()->getOpOperand(idx), 0, false, ::mlir::SideEffects::DefaultResource::get());
    }
  }
  {
    auto valueRange = getODSOperandIndexAndLength(1);
    for (unsigned idx = valueRange.first; idx < valueRange.first + valueRange.second; idx++) {
      effects.emplace_back(::mlir::MemoryEffects::Write::get(), &getOperation()->getOpOperand(idx), 0, false, ::mlir::SideEffects::DefaultResource::get());
    }
  }
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::RawBufferAtomicFaddOp)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::RawBufferAtomicFmaxOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
RawBufferAtomicFmaxOpGenericAdaptorBase::RawBufferAtomicFmaxOpGenericAdaptorBase(RawBufferAtomicFmaxOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

std::pair<unsigned, unsigned> RawBufferAtomicFmaxOpGenericAdaptorBase::getODSOperandIndexAndLength(unsigned index, unsigned odsOperandsSize) {
  ::llvm::ArrayRef<int32_t> sizeAttr = getProperties().operandSegmentSizes;

  unsigned start = 0;
  for (unsigned i = 0; i < index; ++i)
    start += sizeAttr[i];
  return {start, sizeAttr[index]};
}

::mlir::BoolAttr RawBufferAtomicFmaxOpGenericAdaptorBase::getBoundsCheckAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::BoolAttr>(getProperties().boundsCheck);
  return attr;
}

bool RawBufferAtomicFmaxOpGenericAdaptorBase::getBoundsCheck() {
  auto attr = getBoundsCheckAttr();
  return attr.getValue();
}

::std::optional<uint32_t> RawBufferAtomicFmaxOpGenericAdaptorBase::getIndexOffset() {
  auto attr = getIndexOffsetAttr();
  return attr ? ::std::optional<uint32_t>(attr.getValue().getZExtValue()) : (::std::nullopt);
}

} // namespace detail
RawBufferAtomicFmaxOpAdaptor::RawBufferAtomicFmaxOpAdaptor(RawBufferAtomicFmaxOp op) : RawBufferAtomicFmaxOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult RawBufferAtomicFmaxOpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_boundsCheck = getProperties().boundsCheck; (void)tblgen_boundsCheck;
  auto tblgen_indexOffset = getProperties().indexOffset; (void)tblgen_indexOffset;

  if (tblgen_boundsCheck && !((::llvm::isa<::mlir::BoolAttr>(tblgen_boundsCheck))))
    return emitError(loc, "'amdgpu.raw_buffer_atomic_fmax' op ""attribute 'boundsCheck' failed to satisfy constraint: bool attribute");

  if (tblgen_indexOffset && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_indexOffset))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_indexOffset).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.raw_buffer_atomic_fmax' op ""attribute 'indexOffset' failed to satisfy constraint: 32-bit signless integer attribute");
  return ::mlir::success();
}

std::pair<unsigned, unsigned> RawBufferAtomicFmaxOp::getODSOperandIndexAndLength(unsigned index) {
  ::llvm::ArrayRef<int32_t> sizeAttr = getProperties().operandSegmentSizes;

  unsigned start = 0;
  for (unsigned i = 0; i < index; ++i)
    start += sizeAttr[i];
  return {start, sizeAttr[index]};
}

::mlir::MutableOperandRange RawBufferAtomicFmaxOp::getIndicesMutable() {
  auto range = getODSOperandIndexAndLength(2);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second, ::mlir::MutableOperandRange::OperandSegment(2u, {getOperandSegmentSizesAttrName(), ::mlir::DenseI32ArrayAttr::get(getContext(), getProperties().operandSegmentSizes)}));
  return mutableRange;
}

::mlir::MutableOperandRange RawBufferAtomicFmaxOp::getSgprOffsetMutable() {
  auto range = getODSOperandIndexAndLength(3);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second, ::mlir::MutableOperandRange::OperandSegment(3u, {getOperandSegmentSizesAttrName(), ::mlir::DenseI32ArrayAttr::get(getContext(), getProperties().operandSegmentSizes)}));
  return mutableRange;
}

::llvm::LogicalResult RawBufferAtomicFmaxOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.boundsCheck;
       auto attr = dict.get("boundsCheck");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `boundsCheck` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.indexOffset;
       auto attr = dict.get("indexOffset");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `indexOffset` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
{

      auto setFromAttr = [] (auto &propStorage, ::mlir::Attribute propAttr,
               ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) -> ::mlir::LogicalResult {
        return convertFromAttribute(propStorage, propAttr, emitError);
      };
         auto attr = dict.get("operandSegmentSizes");   if (!attr) attr = dict.get("operand_segment_sizes");;
;
      if (attr && ::mlir::failed(setFromAttr(prop.operandSegmentSizes, attr, emitError)))
        return ::mlir::failure();
  }
  return ::mlir::success();
}

::mlir::Attribute RawBufferAtomicFmaxOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.boundsCheck;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("boundsCheck",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.indexOffset;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("indexOffset",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.operandSegmentSizes;
      auto attr = [&]() -> ::mlir::Attribute {
        return ::mlir::DenseI32ArrayAttr::get(ctx, propStorage);
      }();
      attrs.push_back(odsBuilder.getNamedAttr("operandSegmentSizes", attr));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code RawBufferAtomicFmaxOp::computePropertiesHash(const Properties &prop) {
  auto hash_operandSegmentSizes = [] (const auto &propStorage) -> llvm::hash_code {
    using ::llvm::hash_value;
    return ::llvm::hash_combine_range(std::begin(propStorage), std::end(propStorage));;
  };
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.boundsCheck.getAsOpaquePointer()), 
    llvm::hash_value(prop.indexOffset.getAsOpaquePointer()), 
    hash_operandSegmentSizes(prop.operandSegmentSizes));
}

std::optional<mlir::Attribute> RawBufferAtomicFmaxOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "boundsCheck")
      return prop.boundsCheck;

    if (name == "indexOffset")
      return prop.indexOffset;
    if (name == "operand_segment_sizes" || name == "operandSegmentSizes") return [&]() -> ::mlir::Attribute { return ::mlir::DenseI32ArrayAttr::get(ctx, prop.operandSegmentSizes); }();
  return std::nullopt;
}

void RawBufferAtomicFmaxOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "boundsCheck") {
       prop.boundsCheck = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.boundsCheck)>>(value);
       return;
    }

    if (name == "indexOffset") {
       prop.indexOffset = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.indexOffset)>>(value);
       return;
    }
        if (name == "operand_segment_sizes" || name == "operandSegmentSizes") {
       auto arrAttr = ::llvm::dyn_cast_or_null<::mlir::DenseI32ArrayAttr>(value);
       if (!arrAttr) return;
       if (arrAttr.size() != sizeof(prop.operandSegmentSizes) / sizeof(int32_t))
         return;
       llvm::copy(arrAttr.asArrayRef(), prop.operandSegmentSizes.begin());
       return;
    }
}

void RawBufferAtomicFmaxOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.boundsCheck) attrs.append("boundsCheck", prop.boundsCheck);

    if (prop.indexOffset) attrs.append("indexOffset", prop.indexOffset);
  attrs.append("operandSegmentSizes", [&]() -> ::mlir::Attribute { return ::mlir::DenseI32ArrayAttr::get(ctx, prop.operandSegmentSizes); }());
}

::llvm::LogicalResult RawBufferAtomicFmaxOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getBoundsCheckAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU4(attr, "boundsCheck", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getIndexOffsetAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "indexOffset", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult RawBufferAtomicFmaxOp::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readOptionalAttribute(prop.boundsCheck)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.indexOffset)))
    return ::mlir::failure();

  if (reader.getBytecodeVersion() < /*kNativePropertiesODSSegmentSize=*/6) {
    auto &propStorage = prop.operandSegmentSizes;
    ::mlir::DenseI32ArrayAttr attr;
    if (::mlir::failed(reader.readAttribute(attr))) return ::mlir::failure();
    if (attr.size() > static_cast<int64_t>(sizeof(propStorage) / sizeof(int32_t))) {
      reader.emitError("size mismatch for operand/result_segment_size");
      return ::mlir::failure();
    }
    ::llvm::copy(::llvm::ArrayRef<int32_t>(attr), propStorage.begin());
  }

  {
    auto &propStorage = prop.operandSegmentSizes;
    auto readProp = [&]() {

  if (reader.getBytecodeVersion() >= /*kNativePropertiesODSSegmentSize=*/6)
    return reader.readSparseArray(::llvm::MutableArrayRef(propStorage));
;
      return ::mlir::success();
    };
    if (::mlir::failed(readProp()))
      return ::mlir::failure();
  }
  return ::mlir::success();
}

void RawBufferAtomicFmaxOp::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;

  writer.writeOptionalAttribute(prop.boundsCheck);

  writer.writeOptionalAttribute(prop.indexOffset);

if (writer.getBytecodeVersion() < /*kNativePropertiesODSSegmentSize=*/6) {
  auto &propStorage = prop.operandSegmentSizes;
  writer.writeAttribute(::mlir::DenseI32ArrayAttr::get(this->getContext(), propStorage));
}

  {
    auto &propStorage = prop.operandSegmentSizes;

  if (writer.getBytecodeVersion() >= /*kNativePropertiesODSSegmentSize=*/6)
    writer.writeSparseArray(::llvm::ArrayRef(propStorage));
;
  }
}

bool RawBufferAtomicFmaxOp::getBoundsCheck() {
  auto attr = getBoundsCheckAttr();
  return attr.getValue();
}

::std::optional<uint32_t> RawBufferAtomicFmaxOp::getIndexOffset() {
  auto attr = getIndexOffsetAttr();
  return attr ? ::std::optional<uint32_t>(attr.getValue().getZExtValue()) : (::std::nullopt);
}

void RawBufferAtomicFmaxOp::setBoundsCheck(bool attrValue) {
  getProperties().boundsCheck = ::mlir::Builder((*this)->getContext()).getBoolAttr(attrValue);
}

void RawBufferAtomicFmaxOp::setIndexOffset(::std::optional<uint32_t> attrValue) {
    auto &odsProp = getProperties().indexOffset;
    if (attrValue)
      odsProp = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), *attrValue);
    else
      odsProp = nullptr;
}

void RawBufferAtomicFmaxOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value value, ::mlir::Value memref, ::mlir::ValueRange indices, ::mlir::BoolAttr boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(value);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  if (boundsCheck) {
    odsState.getOrAddProperties<Properties>().boundsCheck = boundsCheck;
  }
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
}

void RawBufferAtomicFmaxOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value value, ::mlir::Value memref, ::mlir::ValueRange indices, ::mlir::BoolAttr boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(value);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  if (boundsCheck) {
    odsState.getOrAddProperties<Properties>().boundsCheck = boundsCheck;
  }
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
  assert(resultTypes.size() == 0u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void RawBufferAtomicFmaxOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value value, ::mlir::Value memref, ::mlir::ValueRange indices, bool boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(value);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().boundsCheck = odsBuilder.getBoolAttr(boundsCheck);
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
}

void RawBufferAtomicFmaxOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value value, ::mlir::Value memref, ::mlir::ValueRange indices, bool boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(value);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().boundsCheck = odsBuilder.getBoolAttr(boundsCheck);
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
  assert(resultTypes.size() == 0u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void RawBufferAtomicFmaxOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 0u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<RawBufferAtomicFmaxOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void RawBufferAtomicFmaxOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 0u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void RawBufferAtomicFmaxOp::populateDefaultProperties(::mlir::OperationName opName, Properties &properties) {
  ::mlir::Builder odsBuilder(opName.getContext());
  if (!properties.boundsCheck)
    properties.boundsCheck = odsBuilder.getBoolAttr(true);
}

::llvm::LogicalResult RawBufferAtomicFmaxOp::verifyInvariantsImpl() {
  auto tblgen_boundsCheck = getProperties().boundsCheck; (void)tblgen_boundsCheck;
  auto tblgen_indexOffset = getProperties().indexOffset; (void)tblgen_indexOffset;

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU4(*this, tblgen_boundsCheck, "boundsCheck")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_indexOffset, "indexOffset")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU16(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU4(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup2 = getODSOperands(2);

    for (auto v : valueGroup2) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU14(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup3 = getODSOperands(3);

    if (valueGroup3.size() > 1) {
      return emitOpError("operand group starting at #") << index
          << " requires 0 or 1 element, but found " << valueGroup3.size();
    }

    for (auto v : valueGroup3) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU5(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  if (!(((getElementTypeOrSelf((*this->getODSOperands(0).begin()))) == (getElementTypeOrSelf((*this->getODSOperands(1).begin()))) && (getElementTypeOrSelf((*this->getODSOperands(1).begin()))) == (getElementTypeOrSelf((*this->getODSOperands(0).begin()))))))
    return emitOpError("failed to verify that all of {value, memref} have same element type");
  return ::mlir::success();
}

::llvm::LogicalResult RawBufferAtomicFmaxOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::mlir::ParseResult RawBufferAtomicFmaxOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand valueRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> valueOperands(&valueRawOperand, 1);  ::llvm::SMLoc valueOperandsLoc;
  (void)valueOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand memrefRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> memrefOperands(&memrefRawOperand, 1);  ::llvm::SMLoc memrefOperandsLoc;
  (void)memrefOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> indicesOperands;
  ::llvm::SMLoc indicesOperandsLoc;
  (void)indicesOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> sgprOffsetOperands;
  ::llvm::SMLoc sgprOffsetOperandsLoc;
  (void)sgprOffsetOperandsLoc;
  ::mlir::Type valueRawType{};
  ::llvm::ArrayRef<::mlir::Type> valueTypes(&valueRawType, 1);
  ::mlir::Type memrefRawType{};
  ::llvm::ArrayRef<::mlir::Type> memrefTypes(&memrefRawType, 1);
  ::llvm::SmallVector<::mlir::Type, 1> indicesTypes;
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }

  valueOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(valueRawOperand))
    return ::mlir::failure();
  if (parser.parseArrow())
    return ::mlir::failure();

  memrefOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(memrefRawOperand))
    return ::mlir::failure();
  if (parser.parseLSquare())
    return ::mlir::failure();

  indicesOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperandList(indicesOperands))
    return ::mlir::failure();
  if (parser.parseRSquare())
    return ::mlir::failure();
  if (::mlir::succeeded(parser.parseOptionalKeyword("sgprOffset"))) {

  {
    sgprOffsetOperandsLoc = parser.getCurrentLocation();
    ::mlir::OpAsmParser::UnresolvedOperand operand;
    ::mlir::OptionalParseResult parseResult =
                                    parser.parseOptionalOperand(operand);
    if (parseResult.has_value()) {
      if (failed(*parseResult))
        return ::mlir::failure();
      sgprOffsetOperands.push_back(operand);
    }
  }
  }
  if (parser.parseColon())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    valueRawType = type;
  }
  if (parser.parseArrow())
    return ::mlir::failure();

  {
    ::mlir::MemRefType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    memrefRawType = type;
  }
  if (parser.parseComma())
    return ::mlir::failure();

  if (parser.parseTypeList(indicesTypes))
    return ::mlir::failure();
::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indicesOperands.size()), static_cast<int32_t>(sgprOffsetOperands.size())}), result.getOrAddProperties<RawBufferAtomicFmaxOp::Properties>().operandSegmentSizes.begin());
  ::mlir::Type odsBuildableType0 = parser.getBuilder().getIntegerType(32);
  if (parser.resolveOperands(valueOperands, valueTypes, valueOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(memrefOperands, memrefTypes, memrefOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(indicesOperands, indicesTypes, indicesOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(sgprOffsetOperands, odsBuildableType0, sgprOffsetOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void RawBufferAtomicFmaxOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("operandSegmentSizes");
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getBoundsCheckAttr();
     if(attr && (attr == odsBuilder.getBoolAttr(true)))
       elidedAttrs.push_back("boundsCheck");
  }
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ';
  _odsPrinter << getValue();
  _odsPrinter << ' ' << "->";
  _odsPrinter << ' ';
  _odsPrinter << getMemref();
  _odsPrinter << "[";
  _odsPrinter << getIndices();
  _odsPrinter << "]";
  if (getSgprOffset()) {
    _odsPrinter << ' ' << "sgprOffset";
    _odsPrinter << ' ';
    if (::mlir::Value value = getSgprOffset())
      _odsPrinter << value;
  }
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getValue().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ' ' << "->";
  _odsPrinter << ' ';
  {
    auto type = getMemref().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::MemRefType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ",";
  _odsPrinter << ' ';
  _odsPrinter << getIndices().getTypes();
}

void RawBufferAtomicFmaxOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
  {
    auto valueRange = getODSOperandIndexAndLength(1);
    for (unsigned idx = valueRange.first; idx < valueRange.first + valueRange.second; idx++) {
      effects.emplace_back(::mlir::MemoryEffects::Read::get(), &getOperation()->getOpOperand(idx), 0, false, ::mlir::SideEffects::DefaultResource::get());
    }
  }
  {
    auto valueRange = getODSOperandIndexAndLength(1);
    for (unsigned idx = valueRange.first; idx < valueRange.first + valueRange.second; idx++) {
      effects.emplace_back(::mlir::MemoryEffects::Write::get(), &getOperation()->getOpOperand(idx), 0, false, ::mlir::SideEffects::DefaultResource::get());
    }
  }
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::RawBufferAtomicFmaxOp)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::RawBufferAtomicSmaxOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
RawBufferAtomicSmaxOpGenericAdaptorBase::RawBufferAtomicSmaxOpGenericAdaptorBase(RawBufferAtomicSmaxOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

std::pair<unsigned, unsigned> RawBufferAtomicSmaxOpGenericAdaptorBase::getODSOperandIndexAndLength(unsigned index, unsigned odsOperandsSize) {
  ::llvm::ArrayRef<int32_t> sizeAttr = getProperties().operandSegmentSizes;

  unsigned start = 0;
  for (unsigned i = 0; i < index; ++i)
    start += sizeAttr[i];
  return {start, sizeAttr[index]};
}

::mlir::BoolAttr RawBufferAtomicSmaxOpGenericAdaptorBase::getBoundsCheckAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::BoolAttr>(getProperties().boundsCheck);
  return attr;
}

bool RawBufferAtomicSmaxOpGenericAdaptorBase::getBoundsCheck() {
  auto attr = getBoundsCheckAttr();
  return attr.getValue();
}

::std::optional<uint32_t> RawBufferAtomicSmaxOpGenericAdaptorBase::getIndexOffset() {
  auto attr = getIndexOffsetAttr();
  return attr ? ::std::optional<uint32_t>(attr.getValue().getZExtValue()) : (::std::nullopt);
}

} // namespace detail
RawBufferAtomicSmaxOpAdaptor::RawBufferAtomicSmaxOpAdaptor(RawBufferAtomicSmaxOp op) : RawBufferAtomicSmaxOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult RawBufferAtomicSmaxOpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_boundsCheck = getProperties().boundsCheck; (void)tblgen_boundsCheck;
  auto tblgen_indexOffset = getProperties().indexOffset; (void)tblgen_indexOffset;

  if (tblgen_boundsCheck && !((::llvm::isa<::mlir::BoolAttr>(tblgen_boundsCheck))))
    return emitError(loc, "'amdgpu.raw_buffer_atomic_smax' op ""attribute 'boundsCheck' failed to satisfy constraint: bool attribute");

  if (tblgen_indexOffset && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_indexOffset))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_indexOffset).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.raw_buffer_atomic_smax' op ""attribute 'indexOffset' failed to satisfy constraint: 32-bit signless integer attribute");
  return ::mlir::success();
}

std::pair<unsigned, unsigned> RawBufferAtomicSmaxOp::getODSOperandIndexAndLength(unsigned index) {
  ::llvm::ArrayRef<int32_t> sizeAttr = getProperties().operandSegmentSizes;

  unsigned start = 0;
  for (unsigned i = 0; i < index; ++i)
    start += sizeAttr[i];
  return {start, sizeAttr[index]};
}

::mlir::MutableOperandRange RawBufferAtomicSmaxOp::getIndicesMutable() {
  auto range = getODSOperandIndexAndLength(2);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second, ::mlir::MutableOperandRange::OperandSegment(2u, {getOperandSegmentSizesAttrName(), ::mlir::DenseI32ArrayAttr::get(getContext(), getProperties().operandSegmentSizes)}));
  return mutableRange;
}

::mlir::MutableOperandRange RawBufferAtomicSmaxOp::getSgprOffsetMutable() {
  auto range = getODSOperandIndexAndLength(3);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second, ::mlir::MutableOperandRange::OperandSegment(3u, {getOperandSegmentSizesAttrName(), ::mlir::DenseI32ArrayAttr::get(getContext(), getProperties().operandSegmentSizes)}));
  return mutableRange;
}

::llvm::LogicalResult RawBufferAtomicSmaxOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.boundsCheck;
       auto attr = dict.get("boundsCheck");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `boundsCheck` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.indexOffset;
       auto attr = dict.get("indexOffset");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `indexOffset` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
{

      auto setFromAttr = [] (auto &propStorage, ::mlir::Attribute propAttr,
               ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) -> ::mlir::LogicalResult {
        return convertFromAttribute(propStorage, propAttr, emitError);
      };
         auto attr = dict.get("operandSegmentSizes");   if (!attr) attr = dict.get("operand_segment_sizes");;
;
      if (attr && ::mlir::failed(setFromAttr(prop.operandSegmentSizes, attr, emitError)))
        return ::mlir::failure();
  }
  return ::mlir::success();
}

::mlir::Attribute RawBufferAtomicSmaxOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.boundsCheck;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("boundsCheck",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.indexOffset;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("indexOffset",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.operandSegmentSizes;
      auto attr = [&]() -> ::mlir::Attribute {
        return ::mlir::DenseI32ArrayAttr::get(ctx, propStorage);
      }();
      attrs.push_back(odsBuilder.getNamedAttr("operandSegmentSizes", attr));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code RawBufferAtomicSmaxOp::computePropertiesHash(const Properties &prop) {
  auto hash_operandSegmentSizes = [] (const auto &propStorage) -> llvm::hash_code {
    using ::llvm::hash_value;
    return ::llvm::hash_combine_range(std::begin(propStorage), std::end(propStorage));;
  };
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.boundsCheck.getAsOpaquePointer()), 
    llvm::hash_value(prop.indexOffset.getAsOpaquePointer()), 
    hash_operandSegmentSizes(prop.operandSegmentSizes));
}

std::optional<mlir::Attribute> RawBufferAtomicSmaxOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "boundsCheck")
      return prop.boundsCheck;

    if (name == "indexOffset")
      return prop.indexOffset;
    if (name == "operand_segment_sizes" || name == "operandSegmentSizes") return [&]() -> ::mlir::Attribute { return ::mlir::DenseI32ArrayAttr::get(ctx, prop.operandSegmentSizes); }();
  return std::nullopt;
}

void RawBufferAtomicSmaxOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "boundsCheck") {
       prop.boundsCheck = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.boundsCheck)>>(value);
       return;
    }

    if (name == "indexOffset") {
       prop.indexOffset = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.indexOffset)>>(value);
       return;
    }
        if (name == "operand_segment_sizes" || name == "operandSegmentSizes") {
       auto arrAttr = ::llvm::dyn_cast_or_null<::mlir::DenseI32ArrayAttr>(value);
       if (!arrAttr) return;
       if (arrAttr.size() != sizeof(prop.operandSegmentSizes) / sizeof(int32_t))
         return;
       llvm::copy(arrAttr.asArrayRef(), prop.operandSegmentSizes.begin());
       return;
    }
}

void RawBufferAtomicSmaxOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.boundsCheck) attrs.append("boundsCheck", prop.boundsCheck);

    if (prop.indexOffset) attrs.append("indexOffset", prop.indexOffset);
  attrs.append("operandSegmentSizes", [&]() -> ::mlir::Attribute { return ::mlir::DenseI32ArrayAttr::get(ctx, prop.operandSegmentSizes); }());
}

::llvm::LogicalResult RawBufferAtomicSmaxOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getBoundsCheckAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU4(attr, "boundsCheck", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getIndexOffsetAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "indexOffset", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult RawBufferAtomicSmaxOp::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readOptionalAttribute(prop.boundsCheck)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.indexOffset)))
    return ::mlir::failure();

  if (reader.getBytecodeVersion() < /*kNativePropertiesODSSegmentSize=*/6) {
    auto &propStorage = prop.operandSegmentSizes;
    ::mlir::DenseI32ArrayAttr attr;
    if (::mlir::failed(reader.readAttribute(attr))) return ::mlir::failure();
    if (attr.size() > static_cast<int64_t>(sizeof(propStorage) / sizeof(int32_t))) {
      reader.emitError("size mismatch for operand/result_segment_size");
      return ::mlir::failure();
    }
    ::llvm::copy(::llvm::ArrayRef<int32_t>(attr), propStorage.begin());
  }

  {
    auto &propStorage = prop.operandSegmentSizes;
    auto readProp = [&]() {

  if (reader.getBytecodeVersion() >= /*kNativePropertiesODSSegmentSize=*/6)
    return reader.readSparseArray(::llvm::MutableArrayRef(propStorage));
;
      return ::mlir::success();
    };
    if (::mlir::failed(readProp()))
      return ::mlir::failure();
  }
  return ::mlir::success();
}

void RawBufferAtomicSmaxOp::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;

  writer.writeOptionalAttribute(prop.boundsCheck);

  writer.writeOptionalAttribute(prop.indexOffset);

if (writer.getBytecodeVersion() < /*kNativePropertiesODSSegmentSize=*/6) {
  auto &propStorage = prop.operandSegmentSizes;
  writer.writeAttribute(::mlir::DenseI32ArrayAttr::get(this->getContext(), propStorage));
}

  {
    auto &propStorage = prop.operandSegmentSizes;

  if (writer.getBytecodeVersion() >= /*kNativePropertiesODSSegmentSize=*/6)
    writer.writeSparseArray(::llvm::ArrayRef(propStorage));
;
  }
}

bool RawBufferAtomicSmaxOp::getBoundsCheck() {
  auto attr = getBoundsCheckAttr();
  return attr.getValue();
}

::std::optional<uint32_t> RawBufferAtomicSmaxOp::getIndexOffset() {
  auto attr = getIndexOffsetAttr();
  return attr ? ::std::optional<uint32_t>(attr.getValue().getZExtValue()) : (::std::nullopt);
}

void RawBufferAtomicSmaxOp::setBoundsCheck(bool attrValue) {
  getProperties().boundsCheck = ::mlir::Builder((*this)->getContext()).getBoolAttr(attrValue);
}

void RawBufferAtomicSmaxOp::setIndexOffset(::std::optional<uint32_t> attrValue) {
    auto &odsProp = getProperties().indexOffset;
    if (attrValue)
      odsProp = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), *attrValue);
    else
      odsProp = nullptr;
}

void RawBufferAtomicSmaxOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value value, ::mlir::Value memref, ::mlir::ValueRange indices, ::mlir::BoolAttr boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(value);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  if (boundsCheck) {
    odsState.getOrAddProperties<Properties>().boundsCheck = boundsCheck;
  }
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
}

void RawBufferAtomicSmaxOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value value, ::mlir::Value memref, ::mlir::ValueRange indices, ::mlir::BoolAttr boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(value);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  if (boundsCheck) {
    odsState.getOrAddProperties<Properties>().boundsCheck = boundsCheck;
  }
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
  assert(resultTypes.size() == 0u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void RawBufferAtomicSmaxOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value value, ::mlir::Value memref, ::mlir::ValueRange indices, bool boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(value);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().boundsCheck = odsBuilder.getBoolAttr(boundsCheck);
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
}

void RawBufferAtomicSmaxOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value value, ::mlir::Value memref, ::mlir::ValueRange indices, bool boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(value);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().boundsCheck = odsBuilder.getBoolAttr(boundsCheck);
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
  assert(resultTypes.size() == 0u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void RawBufferAtomicSmaxOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 0u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<RawBufferAtomicSmaxOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void RawBufferAtomicSmaxOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 0u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void RawBufferAtomicSmaxOp::populateDefaultProperties(::mlir::OperationName opName, Properties &properties) {
  ::mlir::Builder odsBuilder(opName.getContext());
  if (!properties.boundsCheck)
    properties.boundsCheck = odsBuilder.getBoolAttr(true);
}

::llvm::LogicalResult RawBufferAtomicSmaxOp::verifyInvariantsImpl() {
  auto tblgen_boundsCheck = getProperties().boundsCheck; (void)tblgen_boundsCheck;
  auto tblgen_indexOffset = getProperties().indexOffset; (void)tblgen_indexOffset;

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU4(*this, tblgen_boundsCheck, "boundsCheck")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_indexOffset, "indexOffset")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU5(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU4(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup2 = getODSOperands(2);

    for (auto v : valueGroup2) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU14(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup3 = getODSOperands(3);

    if (valueGroup3.size() > 1) {
      return emitOpError("operand group starting at #") << index
          << " requires 0 or 1 element, but found " << valueGroup3.size();
    }

    for (auto v : valueGroup3) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU5(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  return ::mlir::success();
}

::llvm::LogicalResult RawBufferAtomicSmaxOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::mlir::ParseResult RawBufferAtomicSmaxOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand valueRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> valueOperands(&valueRawOperand, 1);  ::llvm::SMLoc valueOperandsLoc;
  (void)valueOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand memrefRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> memrefOperands(&memrefRawOperand, 1);  ::llvm::SMLoc memrefOperandsLoc;
  (void)memrefOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> indicesOperands;
  ::llvm::SMLoc indicesOperandsLoc;
  (void)indicesOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> sgprOffsetOperands;
  ::llvm::SMLoc sgprOffsetOperandsLoc;
  (void)sgprOffsetOperandsLoc;
  ::mlir::Type valueRawType{};
  ::llvm::ArrayRef<::mlir::Type> valueTypes(&valueRawType, 1);
  ::mlir::Type memrefRawType{};
  ::llvm::ArrayRef<::mlir::Type> memrefTypes(&memrefRawType, 1);
  ::llvm::SmallVector<::mlir::Type, 1> indicesTypes;
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }

  valueOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(valueRawOperand))
    return ::mlir::failure();
  if (parser.parseArrow())
    return ::mlir::failure();

  memrefOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(memrefRawOperand))
    return ::mlir::failure();
  if (parser.parseLSquare())
    return ::mlir::failure();

  indicesOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperandList(indicesOperands))
    return ::mlir::failure();
  if (parser.parseRSquare())
    return ::mlir::failure();
  if (::mlir::succeeded(parser.parseOptionalKeyword("sgprOffset"))) {

  {
    sgprOffsetOperandsLoc = parser.getCurrentLocation();
    ::mlir::OpAsmParser::UnresolvedOperand operand;
    ::mlir::OptionalParseResult parseResult =
                                    parser.parseOptionalOperand(operand);
    if (parseResult.has_value()) {
      if (failed(*parseResult))
        return ::mlir::failure();
      sgprOffsetOperands.push_back(operand);
    }
  }
  }
  if (parser.parseColon())
    return ::mlir::failure();

  {
    ::mlir::IntegerType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    valueRawType = type;
  }
  if (parser.parseArrow())
    return ::mlir::failure();

  {
    ::mlir::MemRefType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    memrefRawType = type;
  }
  if (parser.parseComma())
    return ::mlir::failure();

  if (parser.parseTypeList(indicesTypes))
    return ::mlir::failure();
::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indicesOperands.size()), static_cast<int32_t>(sgprOffsetOperands.size())}), result.getOrAddProperties<RawBufferAtomicSmaxOp::Properties>().operandSegmentSizes.begin());
  ::mlir::Type odsBuildableType0 = parser.getBuilder().getIntegerType(32);
  if (parser.resolveOperands(valueOperands, valueTypes, valueOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(memrefOperands, memrefTypes, memrefOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(indicesOperands, indicesTypes, indicesOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(sgprOffsetOperands, odsBuildableType0, sgprOffsetOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void RawBufferAtomicSmaxOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("operandSegmentSizes");
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getBoundsCheckAttr();
     if(attr && (attr == odsBuilder.getBoolAttr(true)))
       elidedAttrs.push_back("boundsCheck");
  }
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ';
  _odsPrinter << getValue();
  _odsPrinter << ' ' << "->";
  _odsPrinter << ' ';
  _odsPrinter << getMemref();
  _odsPrinter << "[";
  _odsPrinter << getIndices();
  _odsPrinter << "]";
  if (getSgprOffset()) {
    _odsPrinter << ' ' << "sgprOffset";
    _odsPrinter << ' ';
    if (::mlir::Value value = getSgprOffset())
      _odsPrinter << value;
  }
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getValue().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::IntegerType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ' ' << "->";
  _odsPrinter << ' ';
  {
    auto type = getMemref().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::MemRefType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ",";
  _odsPrinter << ' ';
  _odsPrinter << getIndices().getTypes();
}

void RawBufferAtomicSmaxOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
  {
    auto valueRange = getODSOperandIndexAndLength(1);
    for (unsigned idx = valueRange.first; idx < valueRange.first + valueRange.second; idx++) {
      effects.emplace_back(::mlir::MemoryEffects::Read::get(), &getOperation()->getOpOperand(idx), 0, false, ::mlir::SideEffects::DefaultResource::get());
    }
  }
  {
    auto valueRange = getODSOperandIndexAndLength(1);
    for (unsigned idx = valueRange.first; idx < valueRange.first + valueRange.second; idx++) {
      effects.emplace_back(::mlir::MemoryEffects::Write::get(), &getOperation()->getOpOperand(idx), 0, false, ::mlir::SideEffects::DefaultResource::get());
    }
  }
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::RawBufferAtomicSmaxOp)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::RawBufferAtomicUminOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
RawBufferAtomicUminOpGenericAdaptorBase::RawBufferAtomicUminOpGenericAdaptorBase(RawBufferAtomicUminOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

std::pair<unsigned, unsigned> RawBufferAtomicUminOpGenericAdaptorBase::getODSOperandIndexAndLength(unsigned index, unsigned odsOperandsSize) {
  ::llvm::ArrayRef<int32_t> sizeAttr = getProperties().operandSegmentSizes;

  unsigned start = 0;
  for (unsigned i = 0; i < index; ++i)
    start += sizeAttr[i];
  return {start, sizeAttr[index]};
}

::mlir::BoolAttr RawBufferAtomicUminOpGenericAdaptorBase::getBoundsCheckAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::BoolAttr>(getProperties().boundsCheck);
  return attr;
}

bool RawBufferAtomicUminOpGenericAdaptorBase::getBoundsCheck() {
  auto attr = getBoundsCheckAttr();
  return attr.getValue();
}

::std::optional<uint32_t> RawBufferAtomicUminOpGenericAdaptorBase::getIndexOffset() {
  auto attr = getIndexOffsetAttr();
  return attr ? ::std::optional<uint32_t>(attr.getValue().getZExtValue()) : (::std::nullopt);
}

} // namespace detail
RawBufferAtomicUminOpAdaptor::RawBufferAtomicUminOpAdaptor(RawBufferAtomicUminOp op) : RawBufferAtomicUminOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult RawBufferAtomicUminOpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_boundsCheck = getProperties().boundsCheck; (void)tblgen_boundsCheck;
  auto tblgen_indexOffset = getProperties().indexOffset; (void)tblgen_indexOffset;

  if (tblgen_boundsCheck && !((::llvm::isa<::mlir::BoolAttr>(tblgen_boundsCheck))))
    return emitError(loc, "'amdgpu.raw_buffer_atomic_umin' op ""attribute 'boundsCheck' failed to satisfy constraint: bool attribute");

  if (tblgen_indexOffset && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_indexOffset))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_indexOffset).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.raw_buffer_atomic_umin' op ""attribute 'indexOffset' failed to satisfy constraint: 32-bit signless integer attribute");
  return ::mlir::success();
}

std::pair<unsigned, unsigned> RawBufferAtomicUminOp::getODSOperandIndexAndLength(unsigned index) {
  ::llvm::ArrayRef<int32_t> sizeAttr = getProperties().operandSegmentSizes;

  unsigned start = 0;
  for (unsigned i = 0; i < index; ++i)
    start += sizeAttr[i];
  return {start, sizeAttr[index]};
}

::mlir::MutableOperandRange RawBufferAtomicUminOp::getIndicesMutable() {
  auto range = getODSOperandIndexAndLength(2);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second, ::mlir::MutableOperandRange::OperandSegment(2u, {getOperandSegmentSizesAttrName(), ::mlir::DenseI32ArrayAttr::get(getContext(), getProperties().operandSegmentSizes)}));
  return mutableRange;
}

::mlir::MutableOperandRange RawBufferAtomicUminOp::getSgprOffsetMutable() {
  auto range = getODSOperandIndexAndLength(3);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second, ::mlir::MutableOperandRange::OperandSegment(3u, {getOperandSegmentSizesAttrName(), ::mlir::DenseI32ArrayAttr::get(getContext(), getProperties().operandSegmentSizes)}));
  return mutableRange;
}

::llvm::LogicalResult RawBufferAtomicUminOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.boundsCheck;
       auto attr = dict.get("boundsCheck");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `boundsCheck` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.indexOffset;
       auto attr = dict.get("indexOffset");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `indexOffset` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
{

      auto setFromAttr = [] (auto &propStorage, ::mlir::Attribute propAttr,
               ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) -> ::mlir::LogicalResult {
        return convertFromAttribute(propStorage, propAttr, emitError);
      };
         auto attr = dict.get("operandSegmentSizes");   if (!attr) attr = dict.get("operand_segment_sizes");;
;
      if (attr && ::mlir::failed(setFromAttr(prop.operandSegmentSizes, attr, emitError)))
        return ::mlir::failure();
  }
  return ::mlir::success();
}

::mlir::Attribute RawBufferAtomicUminOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.boundsCheck;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("boundsCheck",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.indexOffset;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("indexOffset",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.operandSegmentSizes;
      auto attr = [&]() -> ::mlir::Attribute {
        return ::mlir::DenseI32ArrayAttr::get(ctx, propStorage);
      }();
      attrs.push_back(odsBuilder.getNamedAttr("operandSegmentSizes", attr));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code RawBufferAtomicUminOp::computePropertiesHash(const Properties &prop) {
  auto hash_operandSegmentSizes = [] (const auto &propStorage) -> llvm::hash_code {
    using ::llvm::hash_value;
    return ::llvm::hash_combine_range(std::begin(propStorage), std::end(propStorage));;
  };
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.boundsCheck.getAsOpaquePointer()), 
    llvm::hash_value(prop.indexOffset.getAsOpaquePointer()), 
    hash_operandSegmentSizes(prop.operandSegmentSizes));
}

std::optional<mlir::Attribute> RawBufferAtomicUminOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "boundsCheck")
      return prop.boundsCheck;

    if (name == "indexOffset")
      return prop.indexOffset;
    if (name == "operand_segment_sizes" || name == "operandSegmentSizes") return [&]() -> ::mlir::Attribute { return ::mlir::DenseI32ArrayAttr::get(ctx, prop.operandSegmentSizes); }();
  return std::nullopt;
}

void RawBufferAtomicUminOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "boundsCheck") {
       prop.boundsCheck = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.boundsCheck)>>(value);
       return;
    }

    if (name == "indexOffset") {
       prop.indexOffset = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.indexOffset)>>(value);
       return;
    }
        if (name == "operand_segment_sizes" || name == "operandSegmentSizes") {
       auto arrAttr = ::llvm::dyn_cast_or_null<::mlir::DenseI32ArrayAttr>(value);
       if (!arrAttr) return;
       if (arrAttr.size() != sizeof(prop.operandSegmentSizes) / sizeof(int32_t))
         return;
       llvm::copy(arrAttr.asArrayRef(), prop.operandSegmentSizes.begin());
       return;
    }
}

void RawBufferAtomicUminOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.boundsCheck) attrs.append("boundsCheck", prop.boundsCheck);

    if (prop.indexOffset) attrs.append("indexOffset", prop.indexOffset);
  attrs.append("operandSegmentSizes", [&]() -> ::mlir::Attribute { return ::mlir::DenseI32ArrayAttr::get(ctx, prop.operandSegmentSizes); }());
}

::llvm::LogicalResult RawBufferAtomicUminOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getBoundsCheckAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU4(attr, "boundsCheck", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getIndexOffsetAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "indexOffset", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult RawBufferAtomicUminOp::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readOptionalAttribute(prop.boundsCheck)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.indexOffset)))
    return ::mlir::failure();

  if (reader.getBytecodeVersion() < /*kNativePropertiesODSSegmentSize=*/6) {
    auto &propStorage = prop.operandSegmentSizes;
    ::mlir::DenseI32ArrayAttr attr;
    if (::mlir::failed(reader.readAttribute(attr))) return ::mlir::failure();
    if (attr.size() > static_cast<int64_t>(sizeof(propStorage) / sizeof(int32_t))) {
      reader.emitError("size mismatch for operand/result_segment_size");
      return ::mlir::failure();
    }
    ::llvm::copy(::llvm::ArrayRef<int32_t>(attr), propStorage.begin());
  }

  {
    auto &propStorage = prop.operandSegmentSizes;
    auto readProp = [&]() {

  if (reader.getBytecodeVersion() >= /*kNativePropertiesODSSegmentSize=*/6)
    return reader.readSparseArray(::llvm::MutableArrayRef(propStorage));
;
      return ::mlir::success();
    };
    if (::mlir::failed(readProp()))
      return ::mlir::failure();
  }
  return ::mlir::success();
}

void RawBufferAtomicUminOp::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;

  writer.writeOptionalAttribute(prop.boundsCheck);

  writer.writeOptionalAttribute(prop.indexOffset);

if (writer.getBytecodeVersion() < /*kNativePropertiesODSSegmentSize=*/6) {
  auto &propStorage = prop.operandSegmentSizes;
  writer.writeAttribute(::mlir::DenseI32ArrayAttr::get(this->getContext(), propStorage));
}

  {
    auto &propStorage = prop.operandSegmentSizes;

  if (writer.getBytecodeVersion() >= /*kNativePropertiesODSSegmentSize=*/6)
    writer.writeSparseArray(::llvm::ArrayRef(propStorage));
;
  }
}

bool RawBufferAtomicUminOp::getBoundsCheck() {
  auto attr = getBoundsCheckAttr();
  return attr.getValue();
}

::std::optional<uint32_t> RawBufferAtomicUminOp::getIndexOffset() {
  auto attr = getIndexOffsetAttr();
  return attr ? ::std::optional<uint32_t>(attr.getValue().getZExtValue()) : (::std::nullopt);
}

void RawBufferAtomicUminOp::setBoundsCheck(bool attrValue) {
  getProperties().boundsCheck = ::mlir::Builder((*this)->getContext()).getBoolAttr(attrValue);
}

void RawBufferAtomicUminOp::setIndexOffset(::std::optional<uint32_t> attrValue) {
    auto &odsProp = getProperties().indexOffset;
    if (attrValue)
      odsProp = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), *attrValue);
    else
      odsProp = nullptr;
}

void RawBufferAtomicUminOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value value, ::mlir::Value memref, ::mlir::ValueRange indices, ::mlir::BoolAttr boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(value);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  if (boundsCheck) {
    odsState.getOrAddProperties<Properties>().boundsCheck = boundsCheck;
  }
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
}

void RawBufferAtomicUminOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value value, ::mlir::Value memref, ::mlir::ValueRange indices, ::mlir::BoolAttr boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(value);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  if (boundsCheck) {
    odsState.getOrAddProperties<Properties>().boundsCheck = boundsCheck;
  }
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
  assert(resultTypes.size() == 0u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void RawBufferAtomicUminOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value value, ::mlir::Value memref, ::mlir::ValueRange indices, bool boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(value);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().boundsCheck = odsBuilder.getBoolAttr(boundsCheck);
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
}

void RawBufferAtomicUminOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value value, ::mlir::Value memref, ::mlir::ValueRange indices, bool boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(value);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().boundsCheck = odsBuilder.getBoolAttr(boundsCheck);
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
  assert(resultTypes.size() == 0u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void RawBufferAtomicUminOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 0u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<RawBufferAtomicUminOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void RawBufferAtomicUminOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 0u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void RawBufferAtomicUminOp::populateDefaultProperties(::mlir::OperationName opName, Properties &properties) {
  ::mlir::Builder odsBuilder(opName.getContext());
  if (!properties.boundsCheck)
    properties.boundsCheck = odsBuilder.getBoolAttr(true);
}

::llvm::LogicalResult RawBufferAtomicUminOp::verifyInvariantsImpl() {
  auto tblgen_boundsCheck = getProperties().boundsCheck; (void)tblgen_boundsCheck;
  auto tblgen_indexOffset = getProperties().indexOffset; (void)tblgen_indexOffset;

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU4(*this, tblgen_boundsCheck, "boundsCheck")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_indexOffset, "indexOffset")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU5(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU4(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup2 = getODSOperands(2);

    for (auto v : valueGroup2) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU14(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup3 = getODSOperands(3);

    if (valueGroup3.size() > 1) {
      return emitOpError("operand group starting at #") << index
          << " requires 0 or 1 element, but found " << valueGroup3.size();
    }

    for (auto v : valueGroup3) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU5(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  return ::mlir::success();
}

::llvm::LogicalResult RawBufferAtomicUminOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::mlir::ParseResult RawBufferAtomicUminOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand valueRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> valueOperands(&valueRawOperand, 1);  ::llvm::SMLoc valueOperandsLoc;
  (void)valueOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand memrefRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> memrefOperands(&memrefRawOperand, 1);  ::llvm::SMLoc memrefOperandsLoc;
  (void)memrefOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> indicesOperands;
  ::llvm::SMLoc indicesOperandsLoc;
  (void)indicesOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> sgprOffsetOperands;
  ::llvm::SMLoc sgprOffsetOperandsLoc;
  (void)sgprOffsetOperandsLoc;
  ::mlir::Type valueRawType{};
  ::llvm::ArrayRef<::mlir::Type> valueTypes(&valueRawType, 1);
  ::mlir::Type memrefRawType{};
  ::llvm::ArrayRef<::mlir::Type> memrefTypes(&memrefRawType, 1);
  ::llvm::SmallVector<::mlir::Type, 1> indicesTypes;
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }

  valueOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(valueRawOperand))
    return ::mlir::failure();
  if (parser.parseArrow())
    return ::mlir::failure();

  memrefOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(memrefRawOperand))
    return ::mlir::failure();
  if (parser.parseLSquare())
    return ::mlir::failure();

  indicesOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperandList(indicesOperands))
    return ::mlir::failure();
  if (parser.parseRSquare())
    return ::mlir::failure();
  if (::mlir::succeeded(parser.parseOptionalKeyword("sgprOffset"))) {

  {
    sgprOffsetOperandsLoc = parser.getCurrentLocation();
    ::mlir::OpAsmParser::UnresolvedOperand operand;
    ::mlir::OptionalParseResult parseResult =
                                    parser.parseOptionalOperand(operand);
    if (parseResult.has_value()) {
      if (failed(*parseResult))
        return ::mlir::failure();
      sgprOffsetOperands.push_back(operand);
    }
  }
  }
  if (parser.parseColon())
    return ::mlir::failure();

  {
    ::mlir::IntegerType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    valueRawType = type;
  }
  if (parser.parseArrow())
    return ::mlir::failure();

  {
    ::mlir::MemRefType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    memrefRawType = type;
  }
  if (parser.parseComma())
    return ::mlir::failure();

  if (parser.parseTypeList(indicesTypes))
    return ::mlir::failure();
::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indicesOperands.size()), static_cast<int32_t>(sgprOffsetOperands.size())}), result.getOrAddProperties<RawBufferAtomicUminOp::Properties>().operandSegmentSizes.begin());
  ::mlir::Type odsBuildableType0 = parser.getBuilder().getIntegerType(32);
  if (parser.resolveOperands(valueOperands, valueTypes, valueOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(memrefOperands, memrefTypes, memrefOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(indicesOperands, indicesTypes, indicesOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(sgprOffsetOperands, odsBuildableType0, sgprOffsetOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void RawBufferAtomicUminOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("operandSegmentSizes");
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getBoundsCheckAttr();
     if(attr && (attr == odsBuilder.getBoolAttr(true)))
       elidedAttrs.push_back("boundsCheck");
  }
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ';
  _odsPrinter << getValue();
  _odsPrinter << ' ' << "->";
  _odsPrinter << ' ';
  _odsPrinter << getMemref();
  _odsPrinter << "[";
  _odsPrinter << getIndices();
  _odsPrinter << "]";
  if (getSgprOffset()) {
    _odsPrinter << ' ' << "sgprOffset";
    _odsPrinter << ' ';
    if (::mlir::Value value = getSgprOffset())
      _odsPrinter << value;
  }
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getValue().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::IntegerType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ' ' << "->";
  _odsPrinter << ' ';
  {
    auto type = getMemref().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::MemRefType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ",";
  _odsPrinter << ' ';
  _odsPrinter << getIndices().getTypes();
}

void RawBufferAtomicUminOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
  {
    auto valueRange = getODSOperandIndexAndLength(1);
    for (unsigned idx = valueRange.first; idx < valueRange.first + valueRange.second; idx++) {
      effects.emplace_back(::mlir::MemoryEffects::Read::get(), &getOperation()->getOpOperand(idx), 0, false, ::mlir::SideEffects::DefaultResource::get());
    }
  }
  {
    auto valueRange = getODSOperandIndexAndLength(1);
    for (unsigned idx = valueRange.first; idx < valueRange.first + valueRange.second; idx++) {
      effects.emplace_back(::mlir::MemoryEffects::Write::get(), &getOperation()->getOpOperand(idx), 0, false, ::mlir::SideEffects::DefaultResource::get());
    }
  }
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::RawBufferAtomicUminOp)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::RawBufferLoadOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
RawBufferLoadOpGenericAdaptorBase::RawBufferLoadOpGenericAdaptorBase(RawBufferLoadOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

std::pair<unsigned, unsigned> RawBufferLoadOpGenericAdaptorBase::getODSOperandIndexAndLength(unsigned index, unsigned odsOperandsSize) {
  ::llvm::ArrayRef<int32_t> sizeAttr = getProperties().operandSegmentSizes;

  unsigned start = 0;
  for (unsigned i = 0; i < index; ++i)
    start += sizeAttr[i];
  return {start, sizeAttr[index]};
}

::mlir::BoolAttr RawBufferLoadOpGenericAdaptorBase::getBoundsCheckAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::BoolAttr>(getProperties().boundsCheck);
  return attr;
}

bool RawBufferLoadOpGenericAdaptorBase::getBoundsCheck() {
  auto attr = getBoundsCheckAttr();
  return attr.getValue();
}

::std::optional<uint32_t> RawBufferLoadOpGenericAdaptorBase::getIndexOffset() {
  auto attr = getIndexOffsetAttr();
  return attr ? ::std::optional<uint32_t>(attr.getValue().getZExtValue()) : (::std::nullopt);
}

} // namespace detail
RawBufferLoadOpAdaptor::RawBufferLoadOpAdaptor(RawBufferLoadOp op) : RawBufferLoadOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult RawBufferLoadOpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_boundsCheck = getProperties().boundsCheck; (void)tblgen_boundsCheck;
  auto tblgen_indexOffset = getProperties().indexOffset; (void)tblgen_indexOffset;

  if (tblgen_boundsCheck && !((::llvm::isa<::mlir::BoolAttr>(tblgen_boundsCheck))))
    return emitError(loc, "'amdgpu.raw_buffer_load' op ""attribute 'boundsCheck' failed to satisfy constraint: bool attribute");

  if (tblgen_indexOffset && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_indexOffset))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_indexOffset).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.raw_buffer_load' op ""attribute 'indexOffset' failed to satisfy constraint: 32-bit signless integer attribute");
  return ::mlir::success();
}

std::pair<unsigned, unsigned> RawBufferLoadOp::getODSOperandIndexAndLength(unsigned index) {
  ::llvm::ArrayRef<int32_t> sizeAttr = getProperties().operandSegmentSizes;

  unsigned start = 0;
  for (unsigned i = 0; i < index; ++i)
    start += sizeAttr[i];
  return {start, sizeAttr[index]};
}

::mlir::MutableOperandRange RawBufferLoadOp::getIndicesMutable() {
  auto range = getODSOperandIndexAndLength(1);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second, ::mlir::MutableOperandRange::OperandSegment(1u, {getOperandSegmentSizesAttrName(), ::mlir::DenseI32ArrayAttr::get(getContext(), getProperties().operandSegmentSizes)}));
  return mutableRange;
}

::mlir::MutableOperandRange RawBufferLoadOp::getSgprOffsetMutable() {
  auto range = getODSOperandIndexAndLength(2);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second, ::mlir::MutableOperandRange::OperandSegment(2u, {getOperandSegmentSizesAttrName(), ::mlir::DenseI32ArrayAttr::get(getContext(), getProperties().operandSegmentSizes)}));
  return mutableRange;
}

::llvm::LogicalResult RawBufferLoadOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.boundsCheck;
       auto attr = dict.get("boundsCheck");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `boundsCheck` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.indexOffset;
       auto attr = dict.get("indexOffset");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `indexOffset` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
{

      auto setFromAttr = [] (auto &propStorage, ::mlir::Attribute propAttr,
               ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) -> ::mlir::LogicalResult {
        return convertFromAttribute(propStorage, propAttr, emitError);
      };
         auto attr = dict.get("operandSegmentSizes");   if (!attr) attr = dict.get("operand_segment_sizes");;
;
      if (attr && ::mlir::failed(setFromAttr(prop.operandSegmentSizes, attr, emitError)))
        return ::mlir::failure();
  }
  return ::mlir::success();
}

::mlir::Attribute RawBufferLoadOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.boundsCheck;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("boundsCheck",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.indexOffset;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("indexOffset",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.operandSegmentSizes;
      auto attr = [&]() -> ::mlir::Attribute {
        return ::mlir::DenseI32ArrayAttr::get(ctx, propStorage);
      }();
      attrs.push_back(odsBuilder.getNamedAttr("operandSegmentSizes", attr));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code RawBufferLoadOp::computePropertiesHash(const Properties &prop) {
  auto hash_operandSegmentSizes = [] (const auto &propStorage) -> llvm::hash_code {
    using ::llvm::hash_value;
    return ::llvm::hash_combine_range(std::begin(propStorage), std::end(propStorage));;
  };
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.boundsCheck.getAsOpaquePointer()), 
    llvm::hash_value(prop.indexOffset.getAsOpaquePointer()), 
    hash_operandSegmentSizes(prop.operandSegmentSizes));
}

std::optional<mlir::Attribute> RawBufferLoadOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "boundsCheck")
      return prop.boundsCheck;

    if (name == "indexOffset")
      return prop.indexOffset;
    if (name == "operand_segment_sizes" || name == "operandSegmentSizes") return [&]() -> ::mlir::Attribute { return ::mlir::DenseI32ArrayAttr::get(ctx, prop.operandSegmentSizes); }();
  return std::nullopt;
}

void RawBufferLoadOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "boundsCheck") {
       prop.boundsCheck = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.boundsCheck)>>(value);
       return;
    }

    if (name == "indexOffset") {
       prop.indexOffset = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.indexOffset)>>(value);
       return;
    }
        if (name == "operand_segment_sizes" || name == "operandSegmentSizes") {
       auto arrAttr = ::llvm::dyn_cast_or_null<::mlir::DenseI32ArrayAttr>(value);
       if (!arrAttr) return;
       if (arrAttr.size() != sizeof(prop.operandSegmentSizes) / sizeof(int32_t))
         return;
       llvm::copy(arrAttr.asArrayRef(), prop.operandSegmentSizes.begin());
       return;
    }
}

void RawBufferLoadOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.boundsCheck) attrs.append("boundsCheck", prop.boundsCheck);

    if (prop.indexOffset) attrs.append("indexOffset", prop.indexOffset);
  attrs.append("operandSegmentSizes", [&]() -> ::mlir::Attribute { return ::mlir::DenseI32ArrayAttr::get(ctx, prop.operandSegmentSizes); }());
}

::llvm::LogicalResult RawBufferLoadOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getBoundsCheckAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU4(attr, "boundsCheck", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getIndexOffsetAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "indexOffset", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult RawBufferLoadOp::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readOptionalAttribute(prop.boundsCheck)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.indexOffset)))
    return ::mlir::failure();

  if (reader.getBytecodeVersion() < /*kNativePropertiesODSSegmentSize=*/6) {
    auto &propStorage = prop.operandSegmentSizes;
    ::mlir::DenseI32ArrayAttr attr;
    if (::mlir::failed(reader.readAttribute(attr))) return ::mlir::failure();
    if (attr.size() > static_cast<int64_t>(sizeof(propStorage) / sizeof(int32_t))) {
      reader.emitError("size mismatch for operand/result_segment_size");
      return ::mlir::failure();
    }
    ::llvm::copy(::llvm::ArrayRef<int32_t>(attr), propStorage.begin());
  }

  {
    auto &propStorage = prop.operandSegmentSizes;
    auto readProp = [&]() {

  if (reader.getBytecodeVersion() >= /*kNativePropertiesODSSegmentSize=*/6)
    return reader.readSparseArray(::llvm::MutableArrayRef(propStorage));
;
      return ::mlir::success();
    };
    if (::mlir::failed(readProp()))
      return ::mlir::failure();
  }
  return ::mlir::success();
}

void RawBufferLoadOp::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;

  writer.writeOptionalAttribute(prop.boundsCheck);

  writer.writeOptionalAttribute(prop.indexOffset);

if (writer.getBytecodeVersion() < /*kNativePropertiesODSSegmentSize=*/6) {
  auto &propStorage = prop.operandSegmentSizes;
  writer.writeAttribute(::mlir::DenseI32ArrayAttr::get(this->getContext(), propStorage));
}

  {
    auto &propStorage = prop.operandSegmentSizes;

  if (writer.getBytecodeVersion() >= /*kNativePropertiesODSSegmentSize=*/6)
    writer.writeSparseArray(::llvm::ArrayRef(propStorage));
;
  }
}

bool RawBufferLoadOp::getBoundsCheck() {
  auto attr = getBoundsCheckAttr();
  return attr.getValue();
}

::std::optional<uint32_t> RawBufferLoadOp::getIndexOffset() {
  auto attr = getIndexOffsetAttr();
  return attr ? ::std::optional<uint32_t>(attr.getValue().getZExtValue()) : (::std::nullopt);
}

void RawBufferLoadOp::setBoundsCheck(bool attrValue) {
  getProperties().boundsCheck = ::mlir::Builder((*this)->getContext()).getBoolAttr(attrValue);
}

void RawBufferLoadOp::setIndexOffset(::std::optional<uint32_t> attrValue) {
    auto &odsProp = getProperties().indexOffset;
    if (attrValue)
      odsProp = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), *attrValue);
    else
      odsProp = nullptr;
}

void RawBufferLoadOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type value, ::mlir::Value memref, ::mlir::ValueRange indices, ::mlir::BoolAttr boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  if (boundsCheck) {
    odsState.getOrAddProperties<Properties>().boundsCheck = boundsCheck;
  }
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
  odsState.addTypes(value);
}

void RawBufferLoadOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value memref, ::mlir::ValueRange indices, ::mlir::BoolAttr boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  if (boundsCheck) {
    odsState.getOrAddProperties<Properties>().boundsCheck = boundsCheck;
  }
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void RawBufferLoadOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type value, ::mlir::Value memref, ::mlir::ValueRange indices, bool boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().boundsCheck = odsBuilder.getBoolAttr(boundsCheck);
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
  odsState.addTypes(value);
}

void RawBufferLoadOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value memref, ::mlir::ValueRange indices, bool boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().boundsCheck = odsBuilder.getBoolAttr(boundsCheck);
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void RawBufferLoadOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 1u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<RawBufferLoadOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void RawBufferLoadOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 1u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void RawBufferLoadOp::populateDefaultProperties(::mlir::OperationName opName, Properties &properties) {
  ::mlir::Builder odsBuilder(opName.getContext());
  if (!properties.boundsCheck)
    properties.boundsCheck = odsBuilder.getBoolAttr(true);
}

::llvm::LogicalResult RawBufferLoadOp::verifyInvariantsImpl() {
  auto tblgen_boundsCheck = getProperties().boundsCheck; (void)tblgen_boundsCheck;
  auto tblgen_indexOffset = getProperties().indexOffset; (void)tblgen_indexOffset;

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU4(*this, tblgen_boundsCheck, "boundsCheck")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_indexOffset, "indexOffset")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU4(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU14(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup2 = getODSOperands(2);

    if (valueGroup2.size() > 1) {
      return emitOpError("operand group starting at #") << index
          << " requires 0 or 1 element, but found " << valueGroup2.size();
    }

    for (auto v : valueGroup2) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU5(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSResults(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU1(*this, v.getType(), "result", index++)))
        return ::mlir::failure();
    }
  }
  if (!(((getElementTypeOrSelf((*this->getODSResults(0).begin()))) == (getElementTypeOrSelf((*this->getODSOperands(0).begin()))) && (getElementTypeOrSelf((*this->getODSOperands(0).begin()))) == (getElementTypeOrSelf((*this->getODSResults(0).begin()))))))
    return emitOpError("failed to verify that all of {value, memref} have same element type");
  return ::mlir::success();
}

::llvm::LogicalResult RawBufferLoadOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::mlir::ParseResult RawBufferLoadOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand memrefRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> memrefOperands(&memrefRawOperand, 1);  ::llvm::SMLoc memrefOperandsLoc;
  (void)memrefOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> indicesOperands;
  ::llvm::SMLoc indicesOperandsLoc;
  (void)indicesOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> sgprOffsetOperands;
  ::llvm::SMLoc sgprOffsetOperandsLoc;
  (void)sgprOffsetOperandsLoc;
  ::mlir::Type memrefRawType{};
  ::llvm::ArrayRef<::mlir::Type> memrefTypes(&memrefRawType, 1);
  ::llvm::SmallVector<::mlir::Type, 1> indicesTypes;
  ::mlir::Type valueRawType{};
  ::llvm::ArrayRef<::mlir::Type> valueTypes(&valueRawType, 1);
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }

  memrefOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(memrefRawOperand))
    return ::mlir::failure();
  if (parser.parseLSquare())
    return ::mlir::failure();

  indicesOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperandList(indicesOperands))
    return ::mlir::failure();
  if (parser.parseRSquare())
    return ::mlir::failure();
  if (::mlir::succeeded(parser.parseOptionalKeyword("sgprOffset"))) {

  {
    sgprOffsetOperandsLoc = parser.getCurrentLocation();
    ::mlir::OpAsmParser::UnresolvedOperand operand;
    ::mlir::OptionalParseResult parseResult =
                                    parser.parseOptionalOperand(operand);
    if (parseResult.has_value()) {
      if (failed(*parseResult))
        return ::mlir::failure();
      sgprOffsetOperands.push_back(operand);
    }
  }
  }
  if (parser.parseColon())
    return ::mlir::failure();

  {
    ::mlir::MemRefType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    memrefRawType = type;
  }
  if (::mlir::succeeded(parser.parseOptionalComma())) {

  if (parser.parseTypeList(indicesTypes))
    return ::mlir::failure();
  }
  if (parser.parseArrow())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    valueRawType = type;
  }
::llvm::copy(::llvm::ArrayRef<int32_t>({1, static_cast<int32_t>(indicesOperands.size()), static_cast<int32_t>(sgprOffsetOperands.size())}), result.getOrAddProperties<RawBufferLoadOp::Properties>().operandSegmentSizes.begin());
  ::mlir::Type odsBuildableType0 = parser.getBuilder().getIntegerType(32);
  result.addTypes(valueTypes);
  if (parser.resolveOperands(memrefOperands, memrefTypes, memrefOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(indicesOperands, indicesTypes, indicesOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(sgprOffsetOperands, odsBuildableType0, sgprOffsetOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void RawBufferLoadOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("operandSegmentSizes");
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getBoundsCheckAttr();
     if(attr && (attr == odsBuilder.getBoolAttr(true)))
       elidedAttrs.push_back("boundsCheck");
  }
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ';
  _odsPrinter << getMemref();
  _odsPrinter << "[";
  _odsPrinter << getIndices();
  _odsPrinter << "]";
  if (getSgprOffset()) {
    _odsPrinter << ' ' << "sgprOffset";
    _odsPrinter << ' ';
    if (::mlir::Value value = getSgprOffset())
      _odsPrinter << value;
  }
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getMemref().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::MemRefType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  if (!getIndices().empty()) {
    _odsPrinter << ",";
    _odsPrinter << ' ';
    _odsPrinter << getIndices().getTypes();
  }
  _odsPrinter << ' ' << "->";
  _odsPrinter << ' ';
  {
    auto type = getValue().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
}

void RawBufferLoadOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
  {
    auto valueRange = getODSOperandIndexAndLength(0);
    for (unsigned idx = valueRange.first; idx < valueRange.first + valueRange.second; idx++) {
      effects.emplace_back(::mlir::MemoryEffects::Read::get(), &getOperation()->getOpOperand(idx), 0, false, ::mlir::SideEffects::DefaultResource::get());
    }
  }
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::RawBufferLoadOp)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::RawBufferStoreOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
RawBufferStoreOpGenericAdaptorBase::RawBufferStoreOpGenericAdaptorBase(RawBufferStoreOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

std::pair<unsigned, unsigned> RawBufferStoreOpGenericAdaptorBase::getODSOperandIndexAndLength(unsigned index, unsigned odsOperandsSize) {
  ::llvm::ArrayRef<int32_t> sizeAttr = getProperties().operandSegmentSizes;

  unsigned start = 0;
  for (unsigned i = 0; i < index; ++i)
    start += sizeAttr[i];
  return {start, sizeAttr[index]};
}

::mlir::BoolAttr RawBufferStoreOpGenericAdaptorBase::getBoundsCheckAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::BoolAttr>(getProperties().boundsCheck);
  return attr;
}

bool RawBufferStoreOpGenericAdaptorBase::getBoundsCheck() {
  auto attr = getBoundsCheckAttr();
  return attr.getValue();
}

::std::optional<uint32_t> RawBufferStoreOpGenericAdaptorBase::getIndexOffset() {
  auto attr = getIndexOffsetAttr();
  return attr ? ::std::optional<uint32_t>(attr.getValue().getZExtValue()) : (::std::nullopt);
}

} // namespace detail
RawBufferStoreOpAdaptor::RawBufferStoreOpAdaptor(RawBufferStoreOp op) : RawBufferStoreOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult RawBufferStoreOpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_boundsCheck = getProperties().boundsCheck; (void)tblgen_boundsCheck;
  auto tblgen_indexOffset = getProperties().indexOffset; (void)tblgen_indexOffset;

  if (tblgen_boundsCheck && !((::llvm::isa<::mlir::BoolAttr>(tblgen_boundsCheck))))
    return emitError(loc, "'amdgpu.raw_buffer_store' op ""attribute 'boundsCheck' failed to satisfy constraint: bool attribute");

  if (tblgen_indexOffset && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_indexOffset))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_indexOffset).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.raw_buffer_store' op ""attribute 'indexOffset' failed to satisfy constraint: 32-bit signless integer attribute");
  return ::mlir::success();
}

std::pair<unsigned, unsigned> RawBufferStoreOp::getODSOperandIndexAndLength(unsigned index) {
  ::llvm::ArrayRef<int32_t> sizeAttr = getProperties().operandSegmentSizes;

  unsigned start = 0;
  for (unsigned i = 0; i < index; ++i)
    start += sizeAttr[i];
  return {start, sizeAttr[index]};
}

::mlir::MutableOperandRange RawBufferStoreOp::getIndicesMutable() {
  auto range = getODSOperandIndexAndLength(2);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second, ::mlir::MutableOperandRange::OperandSegment(2u, {getOperandSegmentSizesAttrName(), ::mlir::DenseI32ArrayAttr::get(getContext(), getProperties().operandSegmentSizes)}));
  return mutableRange;
}

::mlir::MutableOperandRange RawBufferStoreOp::getSgprOffsetMutable() {
  auto range = getODSOperandIndexAndLength(3);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second, ::mlir::MutableOperandRange::OperandSegment(3u, {getOperandSegmentSizesAttrName(), ::mlir::DenseI32ArrayAttr::get(getContext(), getProperties().operandSegmentSizes)}));
  return mutableRange;
}

::llvm::LogicalResult RawBufferStoreOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.boundsCheck;
       auto attr = dict.get("boundsCheck");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `boundsCheck` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.indexOffset;
       auto attr = dict.get("indexOffset");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `indexOffset` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
{

      auto setFromAttr = [] (auto &propStorage, ::mlir::Attribute propAttr,
               ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) -> ::mlir::LogicalResult {
        return convertFromAttribute(propStorage, propAttr, emitError);
      };
         auto attr = dict.get("operandSegmentSizes");   if (!attr) attr = dict.get("operand_segment_sizes");;
;
      if (attr && ::mlir::failed(setFromAttr(prop.operandSegmentSizes, attr, emitError)))
        return ::mlir::failure();
  }
  return ::mlir::success();
}

::mlir::Attribute RawBufferStoreOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.boundsCheck;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("boundsCheck",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.indexOffset;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("indexOffset",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.operandSegmentSizes;
      auto attr = [&]() -> ::mlir::Attribute {
        return ::mlir::DenseI32ArrayAttr::get(ctx, propStorage);
      }();
      attrs.push_back(odsBuilder.getNamedAttr("operandSegmentSizes", attr));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code RawBufferStoreOp::computePropertiesHash(const Properties &prop) {
  auto hash_operandSegmentSizes = [] (const auto &propStorage) -> llvm::hash_code {
    using ::llvm::hash_value;
    return ::llvm::hash_combine_range(std::begin(propStorage), std::end(propStorage));;
  };
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.boundsCheck.getAsOpaquePointer()), 
    llvm::hash_value(prop.indexOffset.getAsOpaquePointer()), 
    hash_operandSegmentSizes(prop.operandSegmentSizes));
}

std::optional<mlir::Attribute> RawBufferStoreOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "boundsCheck")
      return prop.boundsCheck;

    if (name == "indexOffset")
      return prop.indexOffset;
    if (name == "operand_segment_sizes" || name == "operandSegmentSizes") return [&]() -> ::mlir::Attribute { return ::mlir::DenseI32ArrayAttr::get(ctx, prop.operandSegmentSizes); }();
  return std::nullopt;
}

void RawBufferStoreOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "boundsCheck") {
       prop.boundsCheck = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.boundsCheck)>>(value);
       return;
    }

    if (name == "indexOffset") {
       prop.indexOffset = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.indexOffset)>>(value);
       return;
    }
        if (name == "operand_segment_sizes" || name == "operandSegmentSizes") {
       auto arrAttr = ::llvm::dyn_cast_or_null<::mlir::DenseI32ArrayAttr>(value);
       if (!arrAttr) return;
       if (arrAttr.size() != sizeof(prop.operandSegmentSizes) / sizeof(int32_t))
         return;
       llvm::copy(arrAttr.asArrayRef(), prop.operandSegmentSizes.begin());
       return;
    }
}

void RawBufferStoreOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.boundsCheck) attrs.append("boundsCheck", prop.boundsCheck);

    if (prop.indexOffset) attrs.append("indexOffset", prop.indexOffset);
  attrs.append("operandSegmentSizes", [&]() -> ::mlir::Attribute { return ::mlir::DenseI32ArrayAttr::get(ctx, prop.operandSegmentSizes); }());
}

::llvm::LogicalResult RawBufferStoreOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getBoundsCheckAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU4(attr, "boundsCheck", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getIndexOffsetAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "indexOffset", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult RawBufferStoreOp::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readOptionalAttribute(prop.boundsCheck)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.indexOffset)))
    return ::mlir::failure();

  if (reader.getBytecodeVersion() < /*kNativePropertiesODSSegmentSize=*/6) {
    auto &propStorage = prop.operandSegmentSizes;
    ::mlir::DenseI32ArrayAttr attr;
    if (::mlir::failed(reader.readAttribute(attr))) return ::mlir::failure();
    if (attr.size() > static_cast<int64_t>(sizeof(propStorage) / sizeof(int32_t))) {
      reader.emitError("size mismatch for operand/result_segment_size");
      return ::mlir::failure();
    }
    ::llvm::copy(::llvm::ArrayRef<int32_t>(attr), propStorage.begin());
  }

  {
    auto &propStorage = prop.operandSegmentSizes;
    auto readProp = [&]() {

  if (reader.getBytecodeVersion() >= /*kNativePropertiesODSSegmentSize=*/6)
    return reader.readSparseArray(::llvm::MutableArrayRef(propStorage));
;
      return ::mlir::success();
    };
    if (::mlir::failed(readProp()))
      return ::mlir::failure();
  }
  return ::mlir::success();
}

void RawBufferStoreOp::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;

  writer.writeOptionalAttribute(prop.boundsCheck);

  writer.writeOptionalAttribute(prop.indexOffset);

if (writer.getBytecodeVersion() < /*kNativePropertiesODSSegmentSize=*/6) {
  auto &propStorage = prop.operandSegmentSizes;
  writer.writeAttribute(::mlir::DenseI32ArrayAttr::get(this->getContext(), propStorage));
}

  {
    auto &propStorage = prop.operandSegmentSizes;

  if (writer.getBytecodeVersion() >= /*kNativePropertiesODSSegmentSize=*/6)
    writer.writeSparseArray(::llvm::ArrayRef(propStorage));
;
  }
}

bool RawBufferStoreOp::getBoundsCheck() {
  auto attr = getBoundsCheckAttr();
  return attr.getValue();
}

::std::optional<uint32_t> RawBufferStoreOp::getIndexOffset() {
  auto attr = getIndexOffsetAttr();
  return attr ? ::std::optional<uint32_t>(attr.getValue().getZExtValue()) : (::std::nullopt);
}

void RawBufferStoreOp::setBoundsCheck(bool attrValue) {
  getProperties().boundsCheck = ::mlir::Builder((*this)->getContext()).getBoolAttr(attrValue);
}

void RawBufferStoreOp::setIndexOffset(::std::optional<uint32_t> attrValue) {
    auto &odsProp = getProperties().indexOffset;
    if (attrValue)
      odsProp = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), *attrValue);
    else
      odsProp = nullptr;
}

void RawBufferStoreOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value value, ::mlir::Value memref, ::mlir::ValueRange indices, ::mlir::BoolAttr boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(value);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  if (boundsCheck) {
    odsState.getOrAddProperties<Properties>().boundsCheck = boundsCheck;
  }
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
}

void RawBufferStoreOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value value, ::mlir::Value memref, ::mlir::ValueRange indices, ::mlir::BoolAttr boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(value);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  if (boundsCheck) {
    odsState.getOrAddProperties<Properties>().boundsCheck = boundsCheck;
  }
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
  assert(resultTypes.size() == 0u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void RawBufferStoreOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value value, ::mlir::Value memref, ::mlir::ValueRange indices, bool boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(value);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().boundsCheck = odsBuilder.getBoolAttr(boundsCheck);
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
}

void RawBufferStoreOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value value, ::mlir::Value memref, ::mlir::ValueRange indices, bool boundsCheck, /*optional*/::mlir::IntegerAttr indexOffset, /*optional*/::mlir::Value sgprOffset) {
  odsState.addOperands(value);
  odsState.addOperands(memref);
  odsState.addOperands(indices);
  if (sgprOffset)
    odsState.addOperands(sgprOffset);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indices.size()), (sgprOffset ? 1 : 0)}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().boundsCheck = odsBuilder.getBoolAttr(boundsCheck);
  if (indexOffset) {
    odsState.getOrAddProperties<Properties>().indexOffset = indexOffset;
  }
  assert(resultTypes.size() == 0u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void RawBufferStoreOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 0u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<RawBufferStoreOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void RawBufferStoreOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 0u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void RawBufferStoreOp::populateDefaultProperties(::mlir::OperationName opName, Properties &properties) {
  ::mlir::Builder odsBuilder(opName.getContext());
  if (!properties.boundsCheck)
    properties.boundsCheck = odsBuilder.getBoolAttr(true);
}

::llvm::LogicalResult RawBufferStoreOp::verifyInvariantsImpl() {
  auto tblgen_boundsCheck = getProperties().boundsCheck; (void)tblgen_boundsCheck;
  auto tblgen_indexOffset = getProperties().indexOffset; (void)tblgen_indexOffset;

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU4(*this, tblgen_boundsCheck, "boundsCheck")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_indexOffset, "indexOffset")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU1(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU4(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup2 = getODSOperands(2);

    for (auto v : valueGroup2) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU14(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup3 = getODSOperands(3);

    if (valueGroup3.size() > 1) {
      return emitOpError("operand group starting at #") << index
          << " requires 0 or 1 element, but found " << valueGroup3.size();
    }

    for (auto v : valueGroup3) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU5(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  if (!(((getElementTypeOrSelf((*this->getODSOperands(0).begin()))) == (getElementTypeOrSelf((*this->getODSOperands(1).begin()))) && (getElementTypeOrSelf((*this->getODSOperands(1).begin()))) == (getElementTypeOrSelf((*this->getODSOperands(0).begin()))))))
    return emitOpError("failed to verify that all of {value, memref} have same element type");
  return ::mlir::success();
}

::llvm::LogicalResult RawBufferStoreOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::mlir::ParseResult RawBufferStoreOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand valueRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> valueOperands(&valueRawOperand, 1);  ::llvm::SMLoc valueOperandsLoc;
  (void)valueOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand memrefRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> memrefOperands(&memrefRawOperand, 1);  ::llvm::SMLoc memrefOperandsLoc;
  (void)memrefOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> indicesOperands;
  ::llvm::SMLoc indicesOperandsLoc;
  (void)indicesOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> sgprOffsetOperands;
  ::llvm::SMLoc sgprOffsetOperandsLoc;
  (void)sgprOffsetOperandsLoc;
  ::mlir::Type valueRawType{};
  ::llvm::ArrayRef<::mlir::Type> valueTypes(&valueRawType, 1);
  ::mlir::Type memrefRawType{};
  ::llvm::ArrayRef<::mlir::Type> memrefTypes(&memrefRawType, 1);
  ::llvm::SmallVector<::mlir::Type, 1> indicesTypes;
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }

  valueOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(valueRawOperand))
    return ::mlir::failure();
  if (parser.parseArrow())
    return ::mlir::failure();

  memrefOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(memrefRawOperand))
    return ::mlir::failure();
  if (parser.parseLSquare())
    return ::mlir::failure();

  indicesOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperandList(indicesOperands))
    return ::mlir::failure();
  if (parser.parseRSquare())
    return ::mlir::failure();
  if (::mlir::succeeded(parser.parseOptionalKeyword("sgprOffset"))) {

  {
    sgprOffsetOperandsLoc = parser.getCurrentLocation();
    ::mlir::OpAsmParser::UnresolvedOperand operand;
    ::mlir::OptionalParseResult parseResult =
                                    parser.parseOptionalOperand(operand);
    if (parseResult.has_value()) {
      if (failed(*parseResult))
        return ::mlir::failure();
      sgprOffsetOperands.push_back(operand);
    }
  }
  }
  if (parser.parseColon())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    valueRawType = type;
  }
  if (parser.parseArrow())
    return ::mlir::failure();

  {
    ::mlir::MemRefType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    memrefRawType = type;
  }
  if (::mlir::succeeded(parser.parseOptionalComma())) {

  if (parser.parseTypeList(indicesTypes))
    return ::mlir::failure();
  }
::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(indicesOperands.size()), static_cast<int32_t>(sgprOffsetOperands.size())}), result.getOrAddProperties<RawBufferStoreOp::Properties>().operandSegmentSizes.begin());
  ::mlir::Type odsBuildableType0 = parser.getBuilder().getIntegerType(32);
  if (parser.resolveOperands(valueOperands, valueTypes, valueOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(memrefOperands, memrefTypes, memrefOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(indicesOperands, indicesTypes, indicesOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(sgprOffsetOperands, odsBuildableType0, sgprOffsetOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void RawBufferStoreOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("operandSegmentSizes");
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getBoundsCheckAttr();
     if(attr && (attr == odsBuilder.getBoolAttr(true)))
       elidedAttrs.push_back("boundsCheck");
  }
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ';
  _odsPrinter << getValue();
  _odsPrinter << ' ' << "->";
  _odsPrinter << ' ';
  _odsPrinter << getMemref();
  _odsPrinter << "[";
  _odsPrinter << getIndices();
  _odsPrinter << "]";
  if (getSgprOffset()) {
    _odsPrinter << ' ' << "sgprOffset";
    _odsPrinter << ' ';
    if (::mlir::Value value = getSgprOffset())
      _odsPrinter << value;
  }
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getValue().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ' ' << "->";
  _odsPrinter << ' ';
  {
    auto type = getMemref().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::MemRefType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  if (!getIndices().empty()) {
    _odsPrinter << ",";
    _odsPrinter << ' ';
    _odsPrinter << getIndices().getTypes();
  }
}

void RawBufferStoreOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
  {
    auto valueRange = getODSOperandIndexAndLength(1);
    for (unsigned idx = valueRange.first; idx < valueRange.first + valueRange.second; idx++) {
      effects.emplace_back(::mlir::MemoryEffects::Write::get(), &getOperation()->getOpOperand(idx), 0, false, ::mlir::SideEffects::DefaultResource::get());
    }
  }
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::RawBufferStoreOp)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::ScaledExtPackedOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
ScaledExtPackedOpGenericAdaptorBase::ScaledExtPackedOpGenericAdaptorBase(ScaledExtPackedOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

uint32_t ScaledExtPackedOpGenericAdaptorBase::getIndex() {
  auto attr = getIndexAttr();
  return attr.getValue().getZExtValue();
}

} // namespace detail
ScaledExtPackedOpAdaptor::ScaledExtPackedOpAdaptor(ScaledExtPackedOp op) : ScaledExtPackedOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult ScaledExtPackedOpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_index = getProperties().index; (void)tblgen_index;
  if (!tblgen_index) return emitError(loc, "'amdgpu.scaled_ext_packed' op ""requires attribute 'index'");

  if (tblgen_index && !((((::llvm::isa<::mlir::IntegerAttr>(tblgen_index))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_index).getType().isSignlessInteger(32)))) && ((!::llvm::cast<::mlir::IntegerAttr>(tblgen_index).getValue().isNegative())) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_index).getInt() <= 7))))
    return emitError(loc, "'amdgpu.scaled_ext_packed' op ""attribute 'index' failed to satisfy constraint: 32-bit signless integer attribute whose value is non-negative whose maximum value is 7");
  return ::mlir::success();
}

::llvm::LogicalResult ScaledExtPackedOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.index;
       auto attr = dict.get("index");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `index` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
  return ::mlir::success();
}

::mlir::Attribute ScaledExtPackedOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.index;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("index",
                                       propStorage));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code ScaledExtPackedOp::computePropertiesHash(const Properties &prop) {
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.index.getAsOpaquePointer()));
}

std::optional<mlir::Attribute> ScaledExtPackedOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "index")
      return prop.index;
  return std::nullopt;
}

void ScaledExtPackedOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "index") {
       prop.index = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.index)>>(value);
       return;
    }
}

void ScaledExtPackedOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.index) attrs.append("index", prop.index);
}

::llvm::LogicalResult ScaledExtPackedOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getIndexAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU9(attr, "index", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult ScaledExtPackedOp::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readAttribute(prop.index)))
    return ::mlir::failure();
  return ::mlir::success();
}

void ScaledExtPackedOp::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;
  writer.writeAttribute(prop.index);
}

uint32_t ScaledExtPackedOp::getIndex() {
  auto attr = getIndexAttr();
  return attr.getValue().getZExtValue();
}

void ScaledExtPackedOp::setIndex(uint32_t attrValue) {
  getProperties().index = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void ScaledExtPackedOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type res, ::mlir::Value source, ::mlir::Value scale, ::mlir::IntegerAttr index) {
  odsState.addOperands(source);
  odsState.addOperands(scale);
  odsState.getOrAddProperties<Properties>().index = index;
  odsState.addTypes(res);
}

void ScaledExtPackedOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value source, ::mlir::Value scale, ::mlir::IntegerAttr index) {
  odsState.addOperands(source);
  odsState.addOperands(scale);
  odsState.getOrAddProperties<Properties>().index = index;
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void ScaledExtPackedOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type res, ::mlir::Value source, ::mlir::Value scale, uint32_t index) {
  odsState.addOperands(source);
  odsState.addOperands(scale);
  odsState.getOrAddProperties<Properties>().index = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), index);
  odsState.addTypes(res);
}

void ScaledExtPackedOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value source, ::mlir::Value scale, uint32_t index) {
  odsState.addOperands(source);
  odsState.addOperands(scale);
  odsState.getOrAddProperties<Properties>().index = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), index);
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void ScaledExtPackedOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() == 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<ScaledExtPackedOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void ScaledExtPackedOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() == 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

::llvm::LogicalResult ScaledExtPackedOp::verifyInvariantsImpl() {
  auto tblgen_index = getProperties().index; (void)tblgen_index;
  if (!tblgen_index) return emitOpError("requires attribute 'index'");

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU9(*this, tblgen_index, "index")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU17(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU11(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSResults(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU18(*this, v.getType(), "result", index++)))
        return ::mlir::failure();
    }
  }
  return ::mlir::success();
}

::llvm::LogicalResult ScaledExtPackedOp::verifyInvariants() {
  return verifyInvariantsImpl();
}

::mlir::ParseResult ScaledExtPackedOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand sourceRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> sourceOperands(&sourceRawOperand, 1);  ::llvm::SMLoc sourceOperandsLoc;
  (void)sourceOperandsLoc;
  ::mlir::IntegerAttr indexAttr;
  ::mlir::OpAsmParser::UnresolvedOperand scaleRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> scaleOperands(&scaleRawOperand, 1);  ::llvm::SMLoc scaleOperandsLoc;
  (void)scaleOperandsLoc;
  ::mlir::Type sourceRawType{};
  ::llvm::ArrayRef<::mlir::Type> sourceTypes(&sourceRawType, 1);
  ::mlir::Type resRawType{};
  ::llvm::ArrayRef<::mlir::Type> resTypes(&resRawType, 1);
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }

  sourceOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(sourceRawOperand))
    return ::mlir::failure();
  if (parser.parseLSquare())
    return ::mlir::failure();

  if (parser.parseCustomAttributeWithFallback(indexAttr, parser.getBuilder().getIntegerType(32))) {
    return ::mlir::failure();
  }
  if (indexAttr) result.getOrAddProperties<ScaledExtPackedOp::Properties>().index = indexAttr;
  if (parser.parseRSquare())
    return ::mlir::failure();
  if (parser.parseComma())
    return ::mlir::failure();

  scaleOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(scaleRawOperand))
    return ::mlir::failure();
  if (parser.parseColon())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    sourceRawType = type;
  }
  if (parser.parseKeyword("to"))
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    resRawType = type;
  }
  ::mlir::Type odsBuildableType0 = parser.getBuilder().getF32Type();
  result.addTypes(resTypes);
  if (parser.resolveOperands(sourceOperands, sourceTypes, sourceOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(scaleOperands, odsBuildableType0, scaleOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void ScaledExtPackedOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("index");
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ';
  _odsPrinter << getSource();
  _odsPrinter << "[";
  _odsPrinter.printAttributeWithoutType(getIndexAttr());
  _odsPrinter << "]";
  _odsPrinter << ",";
  _odsPrinter << ' ';
  _odsPrinter << getScale();
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getSource().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ' ' << "to";
  _odsPrinter << ' ';
  {
    auto type = getRes().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
}

void ScaledExtPackedOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::ScaledExtPackedOp)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::ScaledMFMAOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
ScaledMFMAOpGenericAdaptorBase::ScaledMFMAOpGenericAdaptorBase(ScaledMFMAOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

uint32_t ScaledMFMAOpGenericAdaptorBase::getM() {
  auto attr = getMAttr();
  return attr.getValue().getZExtValue();
}

uint32_t ScaledMFMAOpGenericAdaptorBase::getN() {
  auto attr = getNAttr();
  return attr.getValue().getZExtValue();
}

uint32_t ScaledMFMAOpGenericAdaptorBase::getK() {
  auto attr = getKAttr();
  return attr.getValue().getZExtValue();
}

uint32_t ScaledMFMAOpGenericAdaptorBase::getScalesIdxA() {
  auto attr = getScalesIdxAAttr();
  return attr.getValue().getZExtValue();
}

uint32_t ScaledMFMAOpGenericAdaptorBase::getScalesIdxB() {
  auto attr = getScalesIdxBAttr();
  return attr.getValue().getZExtValue();
}

} // namespace detail
ScaledMFMAOpAdaptor::ScaledMFMAOpAdaptor(ScaledMFMAOp op) : ScaledMFMAOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult ScaledMFMAOpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_k = getProperties().k; (void)tblgen_k;
  if (!tblgen_k) return emitError(loc, "'amdgpu.scaled_mfma' op ""requires attribute 'k'");
  auto tblgen_m = getProperties().m; (void)tblgen_m;
  if (!tblgen_m) return emitError(loc, "'amdgpu.scaled_mfma' op ""requires attribute 'm'");
  auto tblgen_n = getProperties().n; (void)tblgen_n;
  if (!tblgen_n) return emitError(loc, "'amdgpu.scaled_mfma' op ""requires attribute 'n'");
  auto tblgen_scalesIdxA = getProperties().scalesIdxA; (void)tblgen_scalesIdxA;
  if (!tblgen_scalesIdxA) return emitError(loc, "'amdgpu.scaled_mfma' op ""requires attribute 'scalesIdxA'");
  auto tblgen_scalesIdxB = getProperties().scalesIdxB; (void)tblgen_scalesIdxB;
  if (!tblgen_scalesIdxB) return emitError(loc, "'amdgpu.scaled_mfma' op ""requires attribute 'scalesIdxB'");

  if (tblgen_m && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_m))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_m).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.scaled_mfma' op ""attribute 'm' failed to satisfy constraint: 32-bit signless integer attribute");

  if (tblgen_n && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_n))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_n).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.scaled_mfma' op ""attribute 'n' failed to satisfy constraint: 32-bit signless integer attribute");

  if (tblgen_k && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_k))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_k).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.scaled_mfma' op ""attribute 'k' failed to satisfy constraint: 32-bit signless integer attribute");

  if (tblgen_scalesIdxA && !((((::llvm::isa<::mlir::IntegerAttr>(tblgen_scalesIdxA))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_scalesIdxA).getType().isSignlessInteger(32)))) && ((!::llvm::cast<::mlir::IntegerAttr>(tblgen_scalesIdxA).getValue().isNegative())) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_scalesIdxA).getInt() <= 3))))
    return emitError(loc, "'amdgpu.scaled_mfma' op ""attribute 'scalesIdxA' failed to satisfy constraint: 32-bit signless integer attribute whose value is non-negative whose maximum value is 3");

  if (tblgen_scalesIdxB && !((((::llvm::isa<::mlir::IntegerAttr>(tblgen_scalesIdxB))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_scalesIdxB).getType().isSignlessInteger(32)))) && ((!::llvm::cast<::mlir::IntegerAttr>(tblgen_scalesIdxB).getValue().isNegative())) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_scalesIdxB).getInt() <= 3))))
    return emitError(loc, "'amdgpu.scaled_mfma' op ""attribute 'scalesIdxB' failed to satisfy constraint: 32-bit signless integer attribute whose value is non-negative whose maximum value is 3");
  return ::mlir::success();
}

::llvm::LogicalResult ScaledMFMAOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.k;
       auto attr = dict.get("k");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `k` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.m;
       auto attr = dict.get("m");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `m` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.n;
       auto attr = dict.get("n");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `n` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.scalesIdxA;
       auto attr = dict.get("scalesIdxA");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `scalesIdxA` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.scalesIdxB;
       auto attr = dict.get("scalesIdxB");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `scalesIdxB` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
  return ::mlir::success();
}

::mlir::Attribute ScaledMFMAOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.k;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("k",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.m;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("m",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.n;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("n",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.scalesIdxA;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("scalesIdxA",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.scalesIdxB;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("scalesIdxB",
                                       propStorage));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code ScaledMFMAOp::computePropertiesHash(const Properties &prop) {
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.k.getAsOpaquePointer()), 
    llvm::hash_value(prop.m.getAsOpaquePointer()), 
    llvm::hash_value(prop.n.getAsOpaquePointer()), 
    llvm::hash_value(prop.scalesIdxA.getAsOpaquePointer()), 
    llvm::hash_value(prop.scalesIdxB.getAsOpaquePointer()));
}

std::optional<mlir::Attribute> ScaledMFMAOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "k")
      return prop.k;

    if (name == "m")
      return prop.m;

    if (name == "n")
      return prop.n;

    if (name == "scalesIdxA")
      return prop.scalesIdxA;

    if (name == "scalesIdxB")
      return prop.scalesIdxB;
  return std::nullopt;
}

void ScaledMFMAOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "k") {
       prop.k = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.k)>>(value);
       return;
    }

    if (name == "m") {
       prop.m = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.m)>>(value);
       return;
    }

    if (name == "n") {
       prop.n = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.n)>>(value);
       return;
    }

    if (name == "scalesIdxA") {
       prop.scalesIdxA = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.scalesIdxA)>>(value);
       return;
    }

    if (name == "scalesIdxB") {
       prop.scalesIdxB = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.scalesIdxB)>>(value);
       return;
    }
}

void ScaledMFMAOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.k) attrs.append("k", prop.k);

    if (prop.m) attrs.append("m", prop.m);

    if (prop.n) attrs.append("n", prop.n);

    if (prop.scalesIdxA) attrs.append("scalesIdxA", prop.scalesIdxA);

    if (prop.scalesIdxB) attrs.append("scalesIdxB", prop.scalesIdxB);
}

::llvm::LogicalResult ScaledMFMAOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getKAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "k", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getMAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "m", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getNAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "n", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getScalesIdxAAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU5(attr, "scalesIdxA", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getScalesIdxBAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU5(attr, "scalesIdxB", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult ScaledMFMAOp::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readAttribute(prop.k)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readAttribute(prop.m)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readAttribute(prop.n)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readAttribute(prop.scalesIdxA)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readAttribute(prop.scalesIdxB)))
    return ::mlir::failure();
  return ::mlir::success();
}

void ScaledMFMAOp::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;
  writer.writeAttribute(prop.k);
  writer.writeAttribute(prop.m);
  writer.writeAttribute(prop.n);
  writer.writeAttribute(prop.scalesIdxA);
  writer.writeAttribute(prop.scalesIdxB);
}

uint32_t ScaledMFMAOp::getM() {
  auto attr = getMAttr();
  return attr.getValue().getZExtValue();
}

uint32_t ScaledMFMAOp::getN() {
  auto attr = getNAttr();
  return attr.getValue().getZExtValue();
}

uint32_t ScaledMFMAOp::getK() {
  auto attr = getKAttr();
  return attr.getValue().getZExtValue();
}

uint32_t ScaledMFMAOp::getScalesIdxA() {
  auto attr = getScalesIdxAAttr();
  return attr.getValue().getZExtValue();
}

uint32_t ScaledMFMAOp::getScalesIdxB() {
  auto attr = getScalesIdxBAttr();
  return attr.getValue().getZExtValue();
}

void ScaledMFMAOp::setM(uint32_t attrValue) {
  getProperties().m = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void ScaledMFMAOp::setN(uint32_t attrValue) {
  getProperties().n = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void ScaledMFMAOp::setK(uint32_t attrValue) {
  getProperties().k = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void ScaledMFMAOp::setScalesIdxA(uint32_t attrValue) {
  getProperties().scalesIdxA = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void ScaledMFMAOp::setScalesIdxB(uint32_t attrValue) {
  getProperties().scalesIdxB = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void ScaledMFMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type destD, ::mlir::IntegerAttr m, ::mlir::IntegerAttr n, ::mlir::IntegerAttr k, ::mlir::Value sourceA, ::mlir::Value sourceB, ::mlir::Value destC, ::mlir::Value scalesA, ::mlir::Value scalesB, ::mlir::IntegerAttr scalesIdxA, ::mlir::IntegerAttr scalesIdxB) {
  odsState.addOperands(sourceA);
  odsState.addOperands(sourceB);
  odsState.addOperands(destC);
  odsState.addOperands(scalesA);
  odsState.addOperands(scalesB);
  odsState.getOrAddProperties<Properties>().m = m;
  odsState.getOrAddProperties<Properties>().n = n;
  odsState.getOrAddProperties<Properties>().k = k;
  odsState.getOrAddProperties<Properties>().scalesIdxA = scalesIdxA;
  odsState.getOrAddProperties<Properties>().scalesIdxB = scalesIdxB;
  odsState.addTypes(destD);
}

void ScaledMFMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::IntegerAttr m, ::mlir::IntegerAttr n, ::mlir::IntegerAttr k, ::mlir::Value sourceA, ::mlir::Value sourceB, ::mlir::Value destC, ::mlir::Value scalesA, ::mlir::Value scalesB, ::mlir::IntegerAttr scalesIdxA, ::mlir::IntegerAttr scalesIdxB) {
  odsState.addOperands(sourceA);
  odsState.addOperands(sourceB);
  odsState.addOperands(destC);
  odsState.addOperands(scalesA);
  odsState.addOperands(scalesB);
  odsState.getOrAddProperties<Properties>().m = m;
  odsState.getOrAddProperties<Properties>().n = n;
  odsState.getOrAddProperties<Properties>().k = k;
  odsState.getOrAddProperties<Properties>().scalesIdxA = scalesIdxA;
  odsState.getOrAddProperties<Properties>().scalesIdxB = scalesIdxB;

        ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
        if (::mlir::succeeded(ScaledMFMAOp::inferReturnTypes(odsBuilder.getContext(),
                      odsState.location, odsState.operands,
                      odsState.attributes.getDictionary(odsState.getContext()),
                      odsState.getRawProperties(),
                      odsState.regions, inferredReturnTypes)))
          odsState.addTypes(inferredReturnTypes);
        else
          ::mlir::detail::reportFatalInferReturnTypesError(odsState);
        
}

void ScaledMFMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::IntegerAttr m, ::mlir::IntegerAttr n, ::mlir::IntegerAttr k, ::mlir::Value sourceA, ::mlir::Value sourceB, ::mlir::Value destC, ::mlir::Value scalesA, ::mlir::Value scalesB, ::mlir::IntegerAttr scalesIdxA, ::mlir::IntegerAttr scalesIdxB) {
  odsState.addOperands(sourceA);
  odsState.addOperands(sourceB);
  odsState.addOperands(destC);
  odsState.addOperands(scalesA);
  odsState.addOperands(scalesB);
  odsState.getOrAddProperties<Properties>().m = m;
  odsState.getOrAddProperties<Properties>().n = n;
  odsState.getOrAddProperties<Properties>().k = k;
  odsState.getOrAddProperties<Properties>().scalesIdxA = scalesIdxA;
  odsState.getOrAddProperties<Properties>().scalesIdxB = scalesIdxB;
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void ScaledMFMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type destD, uint32_t m, uint32_t n, uint32_t k, ::mlir::Value sourceA, ::mlir::Value sourceB, ::mlir::Value destC, ::mlir::Value scalesA, ::mlir::Value scalesB, uint32_t scalesIdxA, uint32_t scalesIdxB) {
  odsState.addOperands(sourceA);
  odsState.addOperands(sourceB);
  odsState.addOperands(destC);
  odsState.addOperands(scalesA);
  odsState.addOperands(scalesB);
  odsState.getOrAddProperties<Properties>().m = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), m);
  odsState.getOrAddProperties<Properties>().n = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), n);
  odsState.getOrAddProperties<Properties>().k = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), k);
  odsState.getOrAddProperties<Properties>().scalesIdxA = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), scalesIdxA);
  odsState.getOrAddProperties<Properties>().scalesIdxB = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), scalesIdxB);
  odsState.addTypes(destD);
}

void ScaledMFMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, uint32_t m, uint32_t n, uint32_t k, ::mlir::Value sourceA, ::mlir::Value sourceB, ::mlir::Value destC, ::mlir::Value scalesA, ::mlir::Value scalesB, uint32_t scalesIdxA, uint32_t scalesIdxB) {
  odsState.addOperands(sourceA);
  odsState.addOperands(sourceB);
  odsState.addOperands(destC);
  odsState.addOperands(scalesA);
  odsState.addOperands(scalesB);
  odsState.getOrAddProperties<Properties>().m = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), m);
  odsState.getOrAddProperties<Properties>().n = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), n);
  odsState.getOrAddProperties<Properties>().k = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), k);
  odsState.getOrAddProperties<Properties>().scalesIdxA = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), scalesIdxA);
  odsState.getOrAddProperties<Properties>().scalesIdxB = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), scalesIdxB);

        ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
        if (::mlir::succeeded(ScaledMFMAOp::inferReturnTypes(odsBuilder.getContext(),
                      odsState.location, odsState.operands,
                      odsState.attributes.getDictionary(odsState.getContext()),
                      odsState.getRawProperties(),
                      odsState.regions, inferredReturnTypes)))
          odsState.addTypes(inferredReturnTypes);
        else
          ::mlir::detail::reportFatalInferReturnTypesError(odsState);
        
}

void ScaledMFMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, uint32_t m, uint32_t n, uint32_t k, ::mlir::Value sourceA, ::mlir::Value sourceB, ::mlir::Value destC, ::mlir::Value scalesA, ::mlir::Value scalesB, uint32_t scalesIdxA, uint32_t scalesIdxB) {
  odsState.addOperands(sourceA);
  odsState.addOperands(sourceB);
  odsState.addOperands(destC);
  odsState.addOperands(scalesA);
  odsState.addOperands(scalesB);
  odsState.getOrAddProperties<Properties>().m = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), m);
  odsState.getOrAddProperties<Properties>().n = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), n);
  odsState.getOrAddProperties<Properties>().k = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), k);
  odsState.getOrAddProperties<Properties>().scalesIdxA = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), scalesIdxA);
  odsState.getOrAddProperties<Properties>().scalesIdxB = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), scalesIdxB);
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void ScaledMFMAOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() == 5u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<ScaledMFMAOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void ScaledMFMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() == 5u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<ScaledMFMAOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
  ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
  if (::mlir::succeeded(ScaledMFMAOp::inferReturnTypes(odsBuilder.getContext(),
          odsState.location, operands,
          odsState.attributes.getDictionary(odsState.getContext()),
          odsState.getRawProperties(),
          odsState.regions, inferredReturnTypes))) {
    assert(inferredReturnTypes.size() == 1u && "mismatched number of return types");
    odsState.addTypes(inferredReturnTypes);
  } else {
    ::llvm::report_fatal_error("Failed to infer result type(s).");
  }
}

void ScaledMFMAOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() == 5u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void ScaledMFMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() == 5u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties &>(properties));
  odsState.addAttributes(discardableAttributes);

  ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
  if (::mlir::succeeded(ScaledMFMAOp::inferReturnTypes(odsBuilder.getContext(),
          odsState.location, operands,
          odsState.attributes.getDictionary(odsState.getContext()),
          odsState.getRawProperties(),
          odsState.regions, inferredReturnTypes))) {
    assert(inferredReturnTypes.size() == 1u && "mismatched number of return types");
    odsState.addTypes(inferredReturnTypes);
  } else {
    ::llvm::report_fatal_error("Failed to infer result type(s).");
  }
}

::llvm::LogicalResult ScaledMFMAOp::verifyInvariantsImpl() {
  auto tblgen_k = getProperties().k; (void)tblgen_k;
  if (!tblgen_k) return emitOpError("requires attribute 'k'");
  auto tblgen_m = getProperties().m; (void)tblgen_m;
  if (!tblgen_m) return emitOpError("requires attribute 'm'");
  auto tblgen_n = getProperties().n; (void)tblgen_n;
  if (!tblgen_n) return emitOpError("requires attribute 'n'");
  auto tblgen_scalesIdxA = getProperties().scalesIdxA; (void)tblgen_scalesIdxA;
  if (!tblgen_scalesIdxA) return emitOpError("requires attribute 'scalesIdxA'");
  auto tblgen_scalesIdxB = getProperties().scalesIdxB; (void)tblgen_scalesIdxB;
  if (!tblgen_scalesIdxB) return emitOpError("requires attribute 'scalesIdxB'");

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_m, "m")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_n, "n")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_k, "k")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU5(*this, tblgen_scalesIdxA, "scalesIdxA")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU5(*this, tblgen_scalesIdxB, "scalesIdxB")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU19(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU19(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup2 = getODSOperands(2);

    for (auto v : valueGroup2) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU20(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup3 = getODSOperands(3);

    for (auto v : valueGroup3) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU21(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup4 = getODSOperands(4);

    for (auto v : valueGroup4) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU21(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSResults(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU20(*this, v.getType(), "result", index++)))
        return ::mlir::failure();
    }
  }
  if (!((((*this->getODSOperands(2).begin()).getType()) == ((*this->getODSResults(0).begin()).getType()) && ((*this->getODSResults(0).begin()).getType()) == ((*this->getODSOperands(2).begin()).getType()))))
    return emitOpError("failed to verify that all of {destC, destD} have same type");
  return ::mlir::success();
}

::llvm::LogicalResult ScaledMFMAOp::verifyInvariants() {
  return verifyInvariantsImpl();
}

::llvm::LogicalResult ScaledMFMAOp::inferReturnTypes(::mlir::MLIRContext *context, ::std::optional<::mlir::Location> location, ::mlir::ValueRange operands, ::mlir::DictionaryAttr attributes, ::mlir::OpaqueProperties properties, ::mlir::RegionRange regions, ::llvm::SmallVectorImpl<::mlir::Type>&inferredReturnTypes) {
  inferredReturnTypes.resize(1);
  ::mlir::Builder odsBuilder(context);
  if (operands.size() <= 2)
    return ::mlir::failure();
  ::mlir::Type odsInferredType0 = operands[2].getType();
  inferredReturnTypes[0] = odsInferredType0;
  return ::mlir::success();
}

::mlir::ParseResult ScaledMFMAOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand scalesARawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> scalesAOperands(&scalesARawOperand, 1);  ::llvm::SMLoc scalesAOperandsLoc;
  (void)scalesAOperandsLoc;
  ::mlir::IntegerAttr scalesIdxAAttr;
  ::mlir::OpAsmParser::UnresolvedOperand sourceARawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> sourceAOperands(&sourceARawOperand, 1);  ::llvm::SMLoc sourceAOperandsLoc;
  (void)sourceAOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand scalesBRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> scalesBOperands(&scalesBRawOperand, 1);  ::llvm::SMLoc scalesBOperandsLoc;
  (void)scalesBOperandsLoc;
  ::mlir::IntegerAttr scalesIdxBAttr;
  ::mlir::OpAsmParser::UnresolvedOperand sourceBRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> sourceBOperands(&sourceBRawOperand, 1);  ::llvm::SMLoc sourceBOperandsLoc;
  (void)sourceBOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand destCRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> destCOperands(&destCRawOperand, 1);  ::llvm::SMLoc destCOperandsLoc;
  (void)destCOperandsLoc;
  ::mlir::Type scalesARawType{};
  ::llvm::ArrayRef<::mlir::Type> scalesATypes(&scalesARawType, 1);
  ::mlir::Type sourceARawType{};
  ::llvm::ArrayRef<::mlir::Type> sourceATypes(&sourceARawType, 1);
  ::mlir::Type scalesBRawType{};
  ::llvm::ArrayRef<::mlir::Type> scalesBTypes(&scalesBRawType, 1);
  ::mlir::Type sourceBRawType{};
  ::llvm::ArrayRef<::mlir::Type> sourceBTypes(&sourceBRawType, 1);
  ::mlir::Type destCRawType{};
  ::llvm::ArrayRef<::mlir::Type> destCTypes(&destCRawType, 1);
  if (parser.parseLParen())
    return ::mlir::failure();

  scalesAOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(scalesARawOperand))
    return ::mlir::failure();
  if (parser.parseLSquare())
    return ::mlir::failure();

  if (parser.parseCustomAttributeWithFallback(scalesIdxAAttr, parser.getBuilder().getIntegerType(32))) {
    return ::mlir::failure();
  }
  if (scalesIdxAAttr) result.getOrAddProperties<ScaledMFMAOp::Properties>().scalesIdxA = scalesIdxAAttr;
  if (parser.parseRSquare())
    return ::mlir::failure();
  if (parser.parseStar())
    return ::mlir::failure();

  sourceAOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(sourceARawOperand))
    return ::mlir::failure();
  if (parser.parseRParen())
    return ::mlir::failure();
  if (parser.parseStar())
    return ::mlir::failure();
  if (parser.parseLParen())
    return ::mlir::failure();

  scalesBOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(scalesBRawOperand))
    return ::mlir::failure();
  if (parser.parseLSquare())
    return ::mlir::failure();

  if (parser.parseCustomAttributeWithFallback(scalesIdxBAttr, parser.getBuilder().getIntegerType(32))) {
    return ::mlir::failure();
  }
  if (scalesIdxBAttr) result.getOrAddProperties<ScaledMFMAOp::Properties>().scalesIdxB = scalesIdxBAttr;
  if (parser.parseRSquare())
    return ::mlir::failure();
  if (parser.parseStar())
    return ::mlir::failure();

  sourceBOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(sourceBRawOperand))
    return ::mlir::failure();
  if (parser.parseRParen())
    return ::mlir::failure();
  if (parser.parsePlus())
    return ::mlir::failure();

  destCOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(destCRawOperand))
    return ::mlir::failure();
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }
  if (parser.parseColon())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    scalesARawType = type;
  }
  if (parser.parseComma())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    sourceARawType = type;
  }
  if (parser.parseComma())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    scalesBRawType = type;
  }
  if (parser.parseComma())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    sourceBRawType = type;
  }
  if (parser.parseComma())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    destCRawType = type;
  }
  result.addTypes(destCTypes[0]);
  if (parser.resolveOperands(sourceAOperands, sourceATypes, sourceAOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(sourceBOperands, sourceBTypes, sourceBOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(destCOperands, destCTypes, destCOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(scalesAOperands, scalesATypes, scalesAOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(scalesBOperands, scalesBTypes, scalesBOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void ScaledMFMAOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  _odsPrinter << "(";
  _odsPrinter << getScalesA();
  _odsPrinter << "[";
  _odsPrinter.printAttributeWithoutType(getScalesIdxAAttr());
  _odsPrinter << "]";
  _odsPrinter << ' ' << "*";
  _odsPrinter << ' ';
  _odsPrinter << getSourceA();
  _odsPrinter << ")";
  _odsPrinter << ' ' << "*";
  _odsPrinter << ' ' << "(";
  _odsPrinter << getScalesB();
  _odsPrinter << "[";
  _odsPrinter.printAttributeWithoutType(getScalesIdxBAttr());
  _odsPrinter << "]";
  _odsPrinter << ' ' << "*";
  _odsPrinter << ' ';
  _odsPrinter << getSourceB();
  _odsPrinter << ")";
  _odsPrinter << ' ' << "+";
  _odsPrinter << ' ';
  _odsPrinter << getDestC();
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("scalesIdxA");
  elidedAttrs.push_back("scalesIdxB");
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getScalesA().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ",";
  _odsPrinter << ' ';
  {
    auto type = getSourceA().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ",";
  _odsPrinter << ' ';
  {
    auto type = getScalesB().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ",";
  _odsPrinter << ' ';
  {
    auto type = getSourceB().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ",";
  _odsPrinter << ' ';
  {
    auto type = getDestC().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
}

void ScaledMFMAOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::ScaledMFMAOp)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::SchedBarrierOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
SchedBarrierOpGenericAdaptorBase::SchedBarrierOpGenericAdaptorBase(SchedBarrierOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

::mlir::amdgpu::sched_barrier_opt_enum SchedBarrierOpGenericAdaptorBase::getOpts() {
  auto attr = getOptsAttr();
  return attr.getValue();
}

} // namespace detail
SchedBarrierOpAdaptor::SchedBarrierOpAdaptor(SchedBarrierOp op) : SchedBarrierOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult SchedBarrierOpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_opts = getProperties().opts; (void)tblgen_opts;
  if (!tblgen_opts) return emitError(loc, "'amdgpu.sched_barrier' op ""requires attribute 'opts'");

  if (tblgen_opts && !((::llvm::isa<::mlir::amdgpu::sched_barrier_opt_enumAttr>(tblgen_opts))))
    return emitError(loc, "'amdgpu.sched_barrier' op ""attribute 'opts' failed to satisfy constraint: The possible options for scheduling barriers");
  return ::mlir::success();
}

::llvm::LogicalResult SchedBarrierOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.opts;
       auto attr = dict.get("opts");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `opts` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
  return ::mlir::success();
}

::mlir::Attribute SchedBarrierOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.opts;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("opts",
                                       propStorage));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code SchedBarrierOp::computePropertiesHash(const Properties &prop) {
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.opts.getAsOpaquePointer()));
}

std::optional<mlir::Attribute> SchedBarrierOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "opts")
      return prop.opts;
  return std::nullopt;
}

void SchedBarrierOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "opts") {
       prop.opts = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.opts)>>(value);
       return;
    }
}

void SchedBarrierOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.opts) attrs.append("opts", prop.opts);
}

::llvm::LogicalResult SchedBarrierOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getOptsAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU11(attr, "opts", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult SchedBarrierOp::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readAttribute(prop.opts)))
    return ::mlir::failure();
  return ::mlir::success();
}

void SchedBarrierOp::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;
  writer.writeAttribute(prop.opts);
}

::mlir::amdgpu::sched_barrier_opt_enum SchedBarrierOp::getOpts() {
  auto attr = getOptsAttr();
  return attr.getValue();
}

void SchedBarrierOp::setOpts(::mlir::amdgpu::sched_barrier_opt_enum attrValue) {
  getProperties().opts = ::mlir::amdgpu::sched_barrier_opt_enumAttr::get(::mlir::Builder((*this)->getContext()).getContext(), attrValue);
}

void SchedBarrierOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::amdgpu::sched_barrier_opt_enumAttr opts) {
  odsState.getOrAddProperties<Properties>().opts = opts;
}

void SchedBarrierOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::amdgpu::sched_barrier_opt_enumAttr opts) {
  odsState.getOrAddProperties<Properties>().opts = opts;
  assert(resultTypes.size() == 0u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void SchedBarrierOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::amdgpu::sched_barrier_opt_enum opts) {
  odsState.getOrAddProperties<Properties>().opts = ::mlir::amdgpu::sched_barrier_opt_enumAttr::get(odsBuilder.getContext(), opts);
}

void SchedBarrierOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::amdgpu::sched_barrier_opt_enum opts) {
  odsState.getOrAddProperties<Properties>().opts = ::mlir::amdgpu::sched_barrier_opt_enumAttr::get(odsBuilder.getContext(), opts);
  assert(resultTypes.size() == 0u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void SchedBarrierOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() == 0u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 0u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<SchedBarrierOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void SchedBarrierOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() == 0u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 0u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

::llvm::LogicalResult SchedBarrierOp::verifyInvariantsImpl() {
  auto tblgen_opts = getProperties().opts; (void)tblgen_opts;
  if (!tblgen_opts) return emitOpError("requires attribute 'opts'");

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU11(*this, tblgen_opts, "opts")))
    return ::mlir::failure();
  return ::mlir::success();
}

::llvm::LogicalResult SchedBarrierOp::verifyInvariants() {
  return verifyInvariantsImpl();
}

::mlir::ParseResult SchedBarrierOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::amdgpu::sched_barrier_opt_enumAttr optsAttr;
  if (parser.parseKeyword("allow"))
    return ::mlir::failure();
  if (parser.parseEqual())
    return ::mlir::failure();

  if (parser.parseCustomAttributeWithFallback(optsAttr, ::mlir::Type{})) {
    return ::mlir::failure();
  }
  if (optsAttr) result.getOrAddProperties<SchedBarrierOp::Properties>().opts = optsAttr;
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }
  return ::mlir::success();
}

void SchedBarrierOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  _odsPrinter << ' ' << "allow";
  _odsPrinter << ' ' << "=";
  _odsPrinter << ' ';
_odsPrinter.printStrippedAttrOrType(getOptsAttr());
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("opts");
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::SchedBarrierOp)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::SwizzleBitModeOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
SwizzleBitModeOpGenericAdaptorBase::SwizzleBitModeOpGenericAdaptorBase(SwizzleBitModeOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

uint32_t SwizzleBitModeOpGenericAdaptorBase::getAndMask() {
  auto attr = getAndMaskAttr();
  return attr.getValue().getZExtValue();
}

uint32_t SwizzleBitModeOpGenericAdaptorBase::getOrMask() {
  auto attr = getOrMaskAttr();
  return attr.getValue().getZExtValue();
}

uint32_t SwizzleBitModeOpGenericAdaptorBase::getXorMask() {
  auto attr = getXorMaskAttr();
  return attr.getValue().getZExtValue();
}

} // namespace detail
SwizzleBitModeOpAdaptor::SwizzleBitModeOpAdaptor(SwizzleBitModeOp op) : SwizzleBitModeOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult SwizzleBitModeOpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_and_mask = getProperties().and_mask; (void)tblgen_and_mask;
  if (!tblgen_and_mask) return emitError(loc, "'amdgpu.swizzle_bitmode' op ""requires attribute 'and_mask'");
  auto tblgen_or_mask = getProperties().or_mask; (void)tblgen_or_mask;
  if (!tblgen_or_mask) return emitError(loc, "'amdgpu.swizzle_bitmode' op ""requires attribute 'or_mask'");
  auto tblgen_xor_mask = getProperties().xor_mask; (void)tblgen_xor_mask;
  if (!tblgen_xor_mask) return emitError(loc, "'amdgpu.swizzle_bitmode' op ""requires attribute 'xor_mask'");

  if (tblgen_and_mask && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_and_mask))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_and_mask).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.swizzle_bitmode' op ""attribute 'and_mask' failed to satisfy constraint: 32-bit signless integer attribute");

  if (tblgen_or_mask && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_or_mask))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_or_mask).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.swizzle_bitmode' op ""attribute 'or_mask' failed to satisfy constraint: 32-bit signless integer attribute");

  if (tblgen_xor_mask && !(((::llvm::isa<::mlir::IntegerAttr>(tblgen_xor_mask))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_xor_mask).getType().isSignlessInteger(32)))))
    return emitError(loc, "'amdgpu.swizzle_bitmode' op ""attribute 'xor_mask' failed to satisfy constraint: 32-bit signless integer attribute");
  return ::mlir::success();
}

::llvm::LogicalResult SwizzleBitModeOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.and_mask;
       auto attr = dict.get("and_mask");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `and_mask` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.or_mask;
       auto attr = dict.get("or_mask");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `or_mask` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.xor_mask;
       auto attr = dict.get("xor_mask");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `xor_mask` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
  return ::mlir::success();
}

::mlir::Attribute SwizzleBitModeOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.and_mask;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("and_mask",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.or_mask;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("or_mask",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.xor_mask;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("xor_mask",
                                       propStorage));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code SwizzleBitModeOp::computePropertiesHash(const Properties &prop) {
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.and_mask.getAsOpaquePointer()), 
    llvm::hash_value(prop.or_mask.getAsOpaquePointer()), 
    llvm::hash_value(prop.xor_mask.getAsOpaquePointer()));
}

std::optional<mlir::Attribute> SwizzleBitModeOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "and_mask")
      return prop.and_mask;

    if (name == "or_mask")
      return prop.or_mask;

    if (name == "xor_mask")
      return prop.xor_mask;
  return std::nullopt;
}

void SwizzleBitModeOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "and_mask") {
       prop.and_mask = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.and_mask)>>(value);
       return;
    }

    if (name == "or_mask") {
       prop.or_mask = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.or_mask)>>(value);
       return;
    }

    if (name == "xor_mask") {
       prop.xor_mask = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.xor_mask)>>(value);
       return;
    }
}

void SwizzleBitModeOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.and_mask) attrs.append("and_mask", prop.and_mask);

    if (prop.or_mask) attrs.append("or_mask", prop.or_mask);

    if (prop.xor_mask) attrs.append("xor_mask", prop.xor_mask);
}

::llvm::LogicalResult SwizzleBitModeOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getAndMaskAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "and_mask", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getOrMaskAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "or_mask", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getXorMaskAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(attr, "xor_mask", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult SwizzleBitModeOp::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readAttribute(prop.and_mask)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readAttribute(prop.or_mask)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readAttribute(prop.xor_mask)))
    return ::mlir::failure();
  return ::mlir::success();
}

void SwizzleBitModeOp::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;
  writer.writeAttribute(prop.and_mask);
  writer.writeAttribute(prop.or_mask);
  writer.writeAttribute(prop.xor_mask);
}

uint32_t SwizzleBitModeOp::getAndMask() {
  auto attr = getAndMaskAttr();
  return attr.getValue().getZExtValue();
}

uint32_t SwizzleBitModeOp::getOrMask() {
  auto attr = getOrMaskAttr();
  return attr.getValue().getZExtValue();
}

uint32_t SwizzleBitModeOp::getXorMask() {
  auto attr = getXorMaskAttr();
  return attr.getValue().getZExtValue();
}

void SwizzleBitModeOp::setAndMask(uint32_t attrValue) {
  getProperties().and_mask = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void SwizzleBitModeOp::setOrMask(uint32_t attrValue) {
  getProperties().or_mask = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void SwizzleBitModeOp::setXorMask(uint32_t attrValue) {
  getProperties().xor_mask = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void SwizzleBitModeOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type result, ::mlir::Value src, ::mlir::IntegerAttr and_mask, ::mlir::IntegerAttr or_mask, ::mlir::IntegerAttr xor_mask) {
  odsState.addOperands(src);
  odsState.getOrAddProperties<Properties>().and_mask = and_mask;
  odsState.getOrAddProperties<Properties>().or_mask = or_mask;
  odsState.getOrAddProperties<Properties>().xor_mask = xor_mask;
  odsState.addTypes(result);
}

void SwizzleBitModeOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value src, ::mlir::IntegerAttr and_mask, ::mlir::IntegerAttr or_mask, ::mlir::IntegerAttr xor_mask) {
  odsState.addOperands(src);
  odsState.getOrAddProperties<Properties>().and_mask = and_mask;
  odsState.getOrAddProperties<Properties>().or_mask = or_mask;
  odsState.getOrAddProperties<Properties>().xor_mask = xor_mask;

        ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
        if (::mlir::succeeded(SwizzleBitModeOp::inferReturnTypes(odsBuilder.getContext(),
                      odsState.location, odsState.operands,
                      odsState.attributes.getDictionary(odsState.getContext()),
                      odsState.getRawProperties(),
                      odsState.regions, inferredReturnTypes)))
          odsState.addTypes(inferredReturnTypes);
        else
          ::mlir::detail::reportFatalInferReturnTypesError(odsState);
        
}

void SwizzleBitModeOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value src, ::mlir::IntegerAttr and_mask, ::mlir::IntegerAttr or_mask, ::mlir::IntegerAttr xor_mask) {
  odsState.addOperands(src);
  odsState.getOrAddProperties<Properties>().and_mask = and_mask;
  odsState.getOrAddProperties<Properties>().or_mask = or_mask;
  odsState.getOrAddProperties<Properties>().xor_mask = xor_mask;
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void SwizzleBitModeOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type result, ::mlir::Value src, uint32_t and_mask, uint32_t or_mask, uint32_t xor_mask) {
  odsState.addOperands(src);
  odsState.getOrAddProperties<Properties>().and_mask = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), and_mask);
  odsState.getOrAddProperties<Properties>().or_mask = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), or_mask);
  odsState.getOrAddProperties<Properties>().xor_mask = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), xor_mask);
  odsState.addTypes(result);
}

void SwizzleBitModeOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value src, uint32_t and_mask, uint32_t or_mask, uint32_t xor_mask) {
  odsState.addOperands(src);
  odsState.getOrAddProperties<Properties>().and_mask = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), and_mask);
  odsState.getOrAddProperties<Properties>().or_mask = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), or_mask);
  odsState.getOrAddProperties<Properties>().xor_mask = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), xor_mask);

        ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
        if (::mlir::succeeded(SwizzleBitModeOp::inferReturnTypes(odsBuilder.getContext(),
                      odsState.location, odsState.operands,
                      odsState.attributes.getDictionary(odsState.getContext()),
                      odsState.getRawProperties(),
                      odsState.regions, inferredReturnTypes)))
          odsState.addTypes(inferredReturnTypes);
        else
          ::mlir::detail::reportFatalInferReturnTypesError(odsState);
        
}

void SwizzleBitModeOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value src, uint32_t and_mask, uint32_t or_mask, uint32_t xor_mask) {
  odsState.addOperands(src);
  odsState.getOrAddProperties<Properties>().and_mask = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), and_mask);
  odsState.getOrAddProperties<Properties>().or_mask = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), or_mask);
  odsState.getOrAddProperties<Properties>().xor_mask = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), xor_mask);
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void SwizzleBitModeOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() == 1u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<SwizzleBitModeOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void SwizzleBitModeOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() == 1u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<SwizzleBitModeOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
  ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
  if (::mlir::succeeded(SwizzleBitModeOp::inferReturnTypes(odsBuilder.getContext(),
          odsState.location, operands,
          odsState.attributes.getDictionary(odsState.getContext()),
          odsState.getRawProperties(),
          odsState.regions, inferredReturnTypes))) {
    assert(inferredReturnTypes.size() == 1u && "mismatched number of return types");
    odsState.addTypes(inferredReturnTypes);
  } else {
    ::llvm::report_fatal_error("Failed to infer result type(s).");
  }
}

void SwizzleBitModeOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() == 1u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void SwizzleBitModeOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() == 1u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties &>(properties));
  odsState.addAttributes(discardableAttributes);

  ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
  if (::mlir::succeeded(SwizzleBitModeOp::inferReturnTypes(odsBuilder.getContext(),
          odsState.location, operands,
          odsState.attributes.getDictionary(odsState.getContext()),
          odsState.getRawProperties(),
          odsState.regions, inferredReturnTypes))) {
    assert(inferredReturnTypes.size() == 1u && "mismatched number of return types");
    odsState.addTypes(inferredReturnTypes);
  } else {
    ::llvm::report_fatal_error("Failed to infer result type(s).");
  }
}

::llvm::LogicalResult SwizzleBitModeOp::verifyInvariantsImpl() {
  auto tblgen_and_mask = getProperties().and_mask; (void)tblgen_and_mask;
  if (!tblgen_and_mask) return emitOpError("requires attribute 'and_mask'");
  auto tblgen_or_mask = getProperties().or_mask; (void)tblgen_or_mask;
  if (!tblgen_or_mask) return emitOpError("requires attribute 'or_mask'");
  auto tblgen_xor_mask = getProperties().xor_mask; (void)tblgen_xor_mask;
  if (!tblgen_xor_mask) return emitOpError("requires attribute 'xor_mask'");

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_and_mask, "and_mask")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_or_mask, "or_mask")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU3(*this, tblgen_xor_mask, "xor_mask")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU22(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSResults(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU22(*this, v.getType(), "result", index++)))
        return ::mlir::failure();
    }
  }
  if (!((((*this->getODSResults(0).begin()).getType()) == ((*this->getODSOperands(0).begin()).getType()) && ((*this->getODSOperands(0).begin()).getType()) == ((*this->getODSResults(0).begin()).getType()))))
    return emitOpError("failed to verify that all of {result, src} have same type");
  return ::mlir::success();
}

::llvm::LogicalResult SwizzleBitModeOp::verifyInvariants() {
  return verifyInvariantsImpl();
}

::llvm::LogicalResult SwizzleBitModeOp::inferReturnTypes(::mlir::MLIRContext *context, ::std::optional<::mlir::Location> location, ::mlir::ValueRange operands, ::mlir::DictionaryAttr attributes, ::mlir::OpaqueProperties properties, ::mlir::RegionRange regions, ::llvm::SmallVectorImpl<::mlir::Type>&inferredReturnTypes) {
  inferredReturnTypes.resize(1);
  ::mlir::Builder odsBuilder(context);
  if (operands.size() <= 0)
    return ::mlir::failure();
  ::mlir::Type odsInferredType0 = operands[0].getType();
  inferredReturnTypes[0] = odsInferredType0;
  return ::mlir::success();
}

::mlir::ParseResult SwizzleBitModeOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand srcRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> srcOperands(&srcRawOperand, 1);  ::llvm::SMLoc srcOperandsLoc;
  (void)srcOperandsLoc;
  ::mlir::IntegerAttr and_maskAttr;
  ::mlir::IntegerAttr or_maskAttr;
  ::mlir::IntegerAttr xor_maskAttr;
  ::mlir::Type resultRawType{};
  ::llvm::ArrayRef<::mlir::Type> resultTypes(&resultRawType, 1);

  srcOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(srcRawOperand))
    return ::mlir::failure();

  if (parser.parseCustomAttributeWithFallback(and_maskAttr, parser.getBuilder().getIntegerType(32))) {
    return ::mlir::failure();
  }
  if (and_maskAttr) result.getOrAddProperties<SwizzleBitModeOp::Properties>().and_mask = and_maskAttr;

  if (parser.parseCustomAttributeWithFallback(or_maskAttr, parser.getBuilder().getIntegerType(32))) {
    return ::mlir::failure();
  }
  if (or_maskAttr) result.getOrAddProperties<SwizzleBitModeOp::Properties>().or_mask = or_maskAttr;

  if (parser.parseCustomAttributeWithFallback(xor_maskAttr, parser.getBuilder().getIntegerType(32))) {
    return ::mlir::failure();
  }
  if (xor_maskAttr) result.getOrAddProperties<SwizzleBitModeOp::Properties>().xor_mask = xor_maskAttr;
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }
  if (parser.parseColon())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    resultRawType = type;
  }
  result.addTypes(resultTypes);
  if (parser.resolveOperands(srcOperands, resultTypes[0], srcOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void SwizzleBitModeOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  _odsPrinter << ' ';
  _odsPrinter << getSrc();
  _odsPrinter << ' ';
  _odsPrinter.printAttributeWithoutType(getAndMaskAttr());
  _odsPrinter << ' ';
  _odsPrinter.printAttributeWithoutType(getOrMaskAttr());
  _odsPrinter << ' ';
  _odsPrinter.printAttributeWithoutType(getXorMaskAttr());
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("and_mask");
  elidedAttrs.push_back("or_mask");
  elidedAttrs.push_back("xor_mask");
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getResult().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
}

void SwizzleBitModeOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::SwizzleBitModeOp)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::TransposeLoadOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
TransposeLoadOpGenericAdaptorBase::TransposeLoadOpGenericAdaptorBase(TransposeLoadOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

std::pair<unsigned, unsigned> TransposeLoadOpGenericAdaptorBase::getODSOperandIndexAndLength(unsigned index, unsigned odsOperandsSize) {
  bool isVariadic[] = {false, true};
  int prevVariadicCount = 0;
  for (unsigned i = 0; i < index; ++i)
    if (isVariadic[i]) ++prevVariadicCount;

  // Calculate how many dynamic values a static variadic operand corresponds to.
  // This assumes all static variadic operands have the same dynamic value count.
  int variadicSize = (odsOperandsSize - 1) / 1;
  // `index` passed in as the parameter is the static index which counts each
  // operand (variadic or not) as size 1. So here for each previous static variadic
  // operand, we need to offset by (variadicSize - 1) to get where the dynamic
  // value pack for this static operand starts.
  int start = index + (variadicSize - 1) * prevVariadicCount;
  int size = isVariadic[index] ? variadicSize : 1;
  return {start, size};
}

} // namespace detail
TransposeLoadOpAdaptor::TransposeLoadOpAdaptor(TransposeLoadOp op) : TransposeLoadOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult TransposeLoadOpAdaptor::verify(::mlir::Location loc) {
  return ::mlir::success();
}

std::pair<unsigned, unsigned> TransposeLoadOp::getODSOperandIndexAndLength(unsigned index) {
  bool isVariadic[] = {false, true};
  int prevVariadicCount = 0;
  for (unsigned i = 0; i < index; ++i)
    if (isVariadic[i]) ++prevVariadicCount;

  // Calculate how many dynamic values a static variadic operand corresponds to.
  // This assumes all static variadic operands have the same dynamic value count.
  int variadicSize = (getOperation()->getNumOperands() - 1) / 1;
  // `index` passed in as the parameter is the static index which counts each
  // operand (variadic or not) as size 1. So here for each previous static variadic
  // operand, we need to offset by (variadicSize - 1) to get where the dynamic
  // value pack for this static operand starts.
  int start = index + (variadicSize - 1) * prevVariadicCount;
  int size = isVariadic[index] ? variadicSize : 1;
  return {start, size};
}

::mlir::MutableOperandRange TransposeLoadOp::getSrcIndicesMutable() {
  auto range = getODSOperandIndexAndLength(1);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second);
  return mutableRange;
}

::llvm::LogicalResult TransposeLoadOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }
      return ::mlir::success();
}

::mlir::Attribute TransposeLoadOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code TransposeLoadOp::computePropertiesHash(const Properties &prop) {
  using llvm::hash_value;
  return llvm::hash_combine();
}

std::optional<mlir::Attribute> TransposeLoadOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
  return std::nullopt;
}

void TransposeLoadOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
}

void TransposeLoadOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
}

::llvm::LogicalResult TransposeLoadOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    return ::mlir::success();
}

void TransposeLoadOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type result, ::mlir::Value src, ::mlir::ValueRange srcIndices) {
  odsState.addOperands(src);
  odsState.addOperands(srcIndices);
  odsState.addTypes(result);
}

void TransposeLoadOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value src, ::mlir::ValueRange srcIndices) {
  odsState.addOperands(src);
  odsState.addOperands(srcIndices);
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void TransposeLoadOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 1u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void TransposeLoadOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 1u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

::llvm::LogicalResult TransposeLoadOp::verifyInvariantsImpl() {
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU4(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU7(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSResults(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU23(*this, v.getType(), "result", index++)))
        return ::mlir::failure();
    }
  }
  return ::mlir::success();
}

::llvm::LogicalResult TransposeLoadOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::mlir::ParseResult TransposeLoadOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand srcRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> srcOperands(&srcRawOperand, 1);  ::llvm::SMLoc srcOperandsLoc;
  (void)srcOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> srcIndicesOperands;
  ::llvm::SMLoc srcIndicesOperandsLoc;
  (void)srcIndicesOperandsLoc;
  ::mlir::Type srcRawType{};
  ::llvm::ArrayRef<::mlir::Type> srcTypes(&srcRawType, 1);
  ::mlir::Type resultRawType{};
  ::llvm::ArrayRef<::mlir::Type> resultTypes(&resultRawType, 1);

  srcOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(srcRawOperand))
    return ::mlir::failure();
  if (parser.parseLSquare())
    return ::mlir::failure();

  srcIndicesOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperandList(srcIndicesOperands))
    return ::mlir::failure();
  if (parser.parseRSquare())
    return ::mlir::failure();
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }
  if (parser.parseColon())
    return ::mlir::failure();

  {
    ::mlir::MemRefType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    srcRawType = type;
  }
  if (parser.parseArrow())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    resultRawType = type;
  }
  ::mlir::Type odsBuildableType0 = parser.getBuilder().getIndexType();
  result.addTypes(resultTypes);
  if (parser.resolveOperands(srcOperands, srcTypes, srcOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(srcIndicesOperands, odsBuildableType0, srcIndicesOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void TransposeLoadOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  _odsPrinter << ' ';
  _odsPrinter << getSrc();
  _odsPrinter << "[";
  _odsPrinter << getSrcIndices();
  _odsPrinter << "]";
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getSrc().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::MemRefType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ' ' << "->";
  _odsPrinter << ' ';
  {
    auto type = getResult().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
}

void TransposeLoadOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
  {
    auto valueRange = getODSOperandIndexAndLength(0);
    for (unsigned idx = valueRange.first; idx < valueRange.first + valueRange.second; idx++) {
      effects.emplace_back(::mlir::MemoryEffects::Read::get(), &getOperation()->getOpOperand(idx), 0, false, ::mlir::SideEffects::DefaultResource::get());
    }
  }
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::TransposeLoadOp)

namespace mlir {
namespace amdgpu {

//===----------------------------------------------------------------------===//
// ::mlir::amdgpu::WMMAOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
WMMAOpGenericAdaptorBase::WMMAOpGenericAdaptorBase(WMMAOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

::mlir::IntegerAttr WMMAOpGenericAdaptorBase::getSubwordOffsetAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::IntegerAttr>(getProperties().subwordOffset);
  return attr;
}

uint32_t WMMAOpGenericAdaptorBase::getSubwordOffset() {
  auto attr = getSubwordOffsetAttr();
  return attr.getValue().getZExtValue();
}

::mlir::UnitAttr WMMAOpGenericAdaptorBase::getUnsignedAAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::UnitAttr>(getProperties().unsignedA);
  if (!attr)
    attr = ((false) ? ::mlir::Builder(odsAttrs.getContext()).getUnitAttr() : nullptr);
  return attr;
}

bool WMMAOpGenericAdaptorBase::getUnsignedA() {
  auto attr = getUnsignedAAttr();
    if (!attr)
      return ((false) ? ::mlir::Builder(odsAttrs.getContext()).getUnitAttr() : nullptr) != nullptr;
  return attr != nullptr;
}

::mlir::UnitAttr WMMAOpGenericAdaptorBase::getUnsignedBAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::UnitAttr>(getProperties().unsignedB);
  if (!attr)
    attr = ((false) ? ::mlir::Builder(odsAttrs.getContext()).getUnitAttr() : nullptr);
  return attr;
}

bool WMMAOpGenericAdaptorBase::getUnsignedB() {
  auto attr = getUnsignedBAttr();
    if (!attr)
      return ((false) ? ::mlir::Builder(odsAttrs.getContext()).getUnitAttr() : nullptr) != nullptr;
  return attr != nullptr;
}

::mlir::UnitAttr WMMAOpGenericAdaptorBase::getClampAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::UnitAttr>(getProperties().clamp);
  if (!attr)
    attr = ((false) ? ::mlir::Builder(odsAttrs.getContext()).getUnitAttr() : nullptr);
  return attr;
}

bool WMMAOpGenericAdaptorBase::getClamp() {
  auto attr = getClampAttr();
    if (!attr)
      return ((false) ? ::mlir::Builder(odsAttrs.getContext()).getUnitAttr() : nullptr) != nullptr;
  return attr != nullptr;
}

} // namespace detail
WMMAOpAdaptor::WMMAOpAdaptor(WMMAOp op) : WMMAOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult WMMAOpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_clamp = getProperties().clamp; (void)tblgen_clamp;
  auto tblgen_subwordOffset = getProperties().subwordOffset; (void)tblgen_subwordOffset;
  auto tblgen_unsignedA = getProperties().unsignedA; (void)tblgen_unsignedA;
  auto tblgen_unsignedB = getProperties().unsignedB; (void)tblgen_unsignedB;

  if (tblgen_subwordOffset && !((((::llvm::isa<::mlir::IntegerAttr>(tblgen_subwordOffset))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_subwordOffset).getType().isSignlessInteger(32)))) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_subwordOffset).getInt() >= 0)) && ((::llvm::cast<::mlir::IntegerAttr>(tblgen_subwordOffset).getInt() <= 1))))
    return emitError(loc, "'amdgpu.wmma' op ""attribute 'subwordOffset' failed to satisfy constraint: 32-bit signless integer attribute whose minimum value is 0 whose maximum value is 1");

  if (tblgen_unsignedA && !((::llvm::isa<::mlir::UnitAttr>(tblgen_unsignedA))))
    return emitError(loc, "'amdgpu.wmma' op ""attribute 'unsignedA' failed to satisfy constraint: unit attribute");

  if (tblgen_unsignedB && !((::llvm::isa<::mlir::UnitAttr>(tblgen_unsignedB))))
    return emitError(loc, "'amdgpu.wmma' op ""attribute 'unsignedB' failed to satisfy constraint: unit attribute");

  if (tblgen_clamp && !((::llvm::isa<::mlir::UnitAttr>(tblgen_clamp))))
    return emitError(loc, "'amdgpu.wmma' op ""attribute 'clamp' failed to satisfy constraint: unit attribute");
  return ::mlir::success();
}

::llvm::LogicalResult WMMAOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.clamp;
       auto attr = dict.get("clamp");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `clamp` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.subwordOffset;
       auto attr = dict.get("subwordOffset");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `subwordOffset` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.unsignedA;
       auto attr = dict.get("unsignedA");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `unsignedA` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.unsignedB;
       auto attr = dict.get("unsignedB");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `unsignedB` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
  return ::mlir::success();
}

::mlir::Attribute WMMAOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.clamp;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("clamp",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.subwordOffset;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("subwordOffset",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.unsignedA;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("unsignedA",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.unsignedB;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("unsignedB",
                                       propStorage));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code WMMAOp::computePropertiesHash(const Properties &prop) {
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.clamp.getAsOpaquePointer()), 
    llvm::hash_value(prop.subwordOffset.getAsOpaquePointer()), 
    llvm::hash_value(prop.unsignedA.getAsOpaquePointer()), 
    llvm::hash_value(prop.unsignedB.getAsOpaquePointer()));
}

std::optional<mlir::Attribute> WMMAOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "clamp")
      return prop.clamp;

    if (name == "subwordOffset")
      return prop.subwordOffset;

    if (name == "unsignedA")
      return prop.unsignedA;

    if (name == "unsignedB")
      return prop.unsignedB;
  return std::nullopt;
}

void WMMAOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "clamp") {
       prop.clamp = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.clamp)>>(value);
       return;
    }

    if (name == "subwordOffset") {
       prop.subwordOffset = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.subwordOffset)>>(value);
       return;
    }

    if (name == "unsignedA") {
       prop.unsignedA = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.unsignedA)>>(value);
       return;
    }

    if (name == "unsignedB") {
       prop.unsignedB = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.unsignedB)>>(value);
       return;
    }
}

void WMMAOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.clamp) attrs.append("clamp", prop.clamp);

    if (prop.subwordOffset) attrs.append("subwordOffset", prop.subwordOffset);

    if (prop.unsignedA) attrs.append("unsignedA", prop.unsignedA);

    if (prop.unsignedB) attrs.append("unsignedB", prop.unsignedB);
}

::llvm::LogicalResult WMMAOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getClampAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU8(attr, "clamp", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getSubwordOffsetAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU12(attr, "subwordOffset", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getUnsignedAAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU8(attr, "unsignedA", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getUnsignedBAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU8(attr, "unsignedB", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult WMMAOp::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readOptionalAttribute(prop.clamp)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.subwordOffset)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.unsignedA)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.unsignedB)))
    return ::mlir::failure();
  return ::mlir::success();
}

void WMMAOp::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;

  writer.writeOptionalAttribute(prop.clamp);

  writer.writeOptionalAttribute(prop.subwordOffset);

  writer.writeOptionalAttribute(prop.unsignedA);

  writer.writeOptionalAttribute(prop.unsignedB);
}

uint32_t WMMAOp::getSubwordOffset() {
  auto attr = getSubwordOffsetAttr();
  return attr.getValue().getZExtValue();
}

bool WMMAOp::getUnsignedA() {
  auto attr = getUnsignedAAttr();
    if (!attr)
      return ((false) ? ::mlir::Builder((*this)->getContext()).getUnitAttr() : nullptr) != nullptr;
  return attr != nullptr;
}

bool WMMAOp::getUnsignedB() {
  auto attr = getUnsignedBAttr();
    if (!attr)
      return ((false) ? ::mlir::Builder((*this)->getContext()).getUnitAttr() : nullptr) != nullptr;
  return attr != nullptr;
}

bool WMMAOp::getClamp() {
  auto attr = getClampAttr();
    if (!attr)
      return ((false) ? ::mlir::Builder((*this)->getContext()).getUnitAttr() : nullptr) != nullptr;
  return attr != nullptr;
}

void WMMAOp::setSubwordOffset(uint32_t attrValue) {
  getProperties().subwordOffset = ::mlir::Builder((*this)->getContext()).getIntegerAttr(::mlir::Builder((*this)->getContext()).getIntegerType(32), attrValue);
}

void WMMAOp::setUnsignedA(bool attrValue) {
    auto &odsProp = getProperties().unsignedA;
    if (attrValue)
      odsProp = ((attrValue) ? ::mlir::Builder((*this)->getContext()).getUnitAttr() : nullptr);
    else
      odsProp = nullptr;
}

void WMMAOp::setUnsignedB(bool attrValue) {
    auto &odsProp = getProperties().unsignedB;
    if (attrValue)
      odsProp = ((attrValue) ? ::mlir::Builder((*this)->getContext()).getUnitAttr() : nullptr);
    else
      odsProp = nullptr;
}

void WMMAOp::setClamp(bool attrValue) {
    auto &odsProp = getProperties().clamp;
    if (attrValue)
      odsProp = ((attrValue) ? ::mlir::Builder((*this)->getContext()).getUnitAttr() : nullptr);
    else
      odsProp = nullptr;
}

void WMMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type destD, ::mlir::Value sourceA, ::mlir::Value sourceB, ::mlir::Value destC, ::mlir::IntegerAttr subwordOffset, /*optional*/::mlir::UnitAttr unsignedA, /*optional*/::mlir::UnitAttr unsignedB, /*optional*/::mlir::UnitAttr clamp) {
  odsState.addOperands(sourceA);
  odsState.addOperands(sourceB);
  odsState.addOperands(destC);
  if (subwordOffset) {
    odsState.getOrAddProperties<Properties>().subwordOffset = subwordOffset;
  }
  if (unsignedA) {
    odsState.getOrAddProperties<Properties>().unsignedA = unsignedA;
  }
  if (unsignedB) {
    odsState.getOrAddProperties<Properties>().unsignedB = unsignedB;
  }
  if (clamp) {
    odsState.getOrAddProperties<Properties>().clamp = clamp;
  }
  odsState.addTypes(destD);
}

void WMMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value sourceA, ::mlir::Value sourceB, ::mlir::Value destC, ::mlir::IntegerAttr subwordOffset, /*optional*/::mlir::UnitAttr unsignedA, /*optional*/::mlir::UnitAttr unsignedB, /*optional*/::mlir::UnitAttr clamp) {
  odsState.addOperands(sourceA);
  odsState.addOperands(sourceB);
  odsState.addOperands(destC);
  if (subwordOffset) {
    odsState.getOrAddProperties<Properties>().subwordOffset = subwordOffset;
  }
  if (unsignedA) {
    odsState.getOrAddProperties<Properties>().unsignedA = unsignedA;
  }
  if (unsignedB) {
    odsState.getOrAddProperties<Properties>().unsignedB = unsignedB;
  }
  if (clamp) {
    odsState.getOrAddProperties<Properties>().clamp = clamp;
  }

        ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
        if (::mlir::succeeded(WMMAOp::inferReturnTypes(odsBuilder.getContext(),
                      odsState.location, odsState.operands,
                      odsState.attributes.getDictionary(odsState.getContext()),
                      odsState.getRawProperties(),
                      odsState.regions, inferredReturnTypes)))
          odsState.addTypes(inferredReturnTypes);
        else
          ::mlir::detail::reportFatalInferReturnTypesError(odsState);
        
}

void WMMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value sourceA, ::mlir::Value sourceB, ::mlir::Value destC, ::mlir::IntegerAttr subwordOffset, /*optional*/::mlir::UnitAttr unsignedA, /*optional*/::mlir::UnitAttr unsignedB, /*optional*/::mlir::UnitAttr clamp) {
  odsState.addOperands(sourceA);
  odsState.addOperands(sourceB);
  odsState.addOperands(destC);
  if (subwordOffset) {
    odsState.getOrAddProperties<Properties>().subwordOffset = subwordOffset;
  }
  if (unsignedA) {
    odsState.getOrAddProperties<Properties>().unsignedA = unsignedA;
  }
  if (unsignedB) {
    odsState.getOrAddProperties<Properties>().unsignedB = unsignedB;
  }
  if (clamp) {
    odsState.getOrAddProperties<Properties>().clamp = clamp;
  }
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void WMMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type destD, ::mlir::Value sourceA, ::mlir::Value sourceB, ::mlir::Value destC, uint32_t subwordOffset, /*optional*/bool unsignedA, /*optional*/bool unsignedB, /*optional*/bool clamp) {
  odsState.addOperands(sourceA);
  odsState.addOperands(sourceB);
  odsState.addOperands(destC);
  odsState.getOrAddProperties<Properties>().subwordOffset = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), subwordOffset);
  if (unsignedA) {
    odsState.getOrAddProperties<Properties>().unsignedA = ((unsignedA) ? odsBuilder.getUnitAttr() : nullptr);
  }
  if (unsignedB) {
    odsState.getOrAddProperties<Properties>().unsignedB = ((unsignedB) ? odsBuilder.getUnitAttr() : nullptr);
  }
  if (clamp) {
    odsState.getOrAddProperties<Properties>().clamp = ((clamp) ? odsBuilder.getUnitAttr() : nullptr);
  }
  odsState.addTypes(destD);
}

void WMMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value sourceA, ::mlir::Value sourceB, ::mlir::Value destC, uint32_t subwordOffset, /*optional*/bool unsignedA, /*optional*/bool unsignedB, /*optional*/bool clamp) {
  odsState.addOperands(sourceA);
  odsState.addOperands(sourceB);
  odsState.addOperands(destC);
  odsState.getOrAddProperties<Properties>().subwordOffset = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), subwordOffset);
  if (unsignedA) {
    odsState.getOrAddProperties<Properties>().unsignedA = ((unsignedA) ? odsBuilder.getUnitAttr() : nullptr);
  }
  if (unsignedB) {
    odsState.getOrAddProperties<Properties>().unsignedB = ((unsignedB) ? odsBuilder.getUnitAttr() : nullptr);
  }
  if (clamp) {
    odsState.getOrAddProperties<Properties>().clamp = ((clamp) ? odsBuilder.getUnitAttr() : nullptr);
  }

        ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
        if (::mlir::succeeded(WMMAOp::inferReturnTypes(odsBuilder.getContext(),
                      odsState.location, odsState.operands,
                      odsState.attributes.getDictionary(odsState.getContext()),
                      odsState.getRawProperties(),
                      odsState.regions, inferredReturnTypes)))
          odsState.addTypes(inferredReturnTypes);
        else
          ::mlir::detail::reportFatalInferReturnTypesError(odsState);
        
}

void WMMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value sourceA, ::mlir::Value sourceB, ::mlir::Value destC, uint32_t subwordOffset, /*optional*/bool unsignedA, /*optional*/bool unsignedB, /*optional*/bool clamp) {
  odsState.addOperands(sourceA);
  odsState.addOperands(sourceB);
  odsState.addOperands(destC);
  odsState.getOrAddProperties<Properties>().subwordOffset = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), subwordOffset);
  if (unsignedA) {
    odsState.getOrAddProperties<Properties>().unsignedA = ((unsignedA) ? odsBuilder.getUnitAttr() : nullptr);
  }
  if (unsignedB) {
    odsState.getOrAddProperties<Properties>().unsignedB = ((unsignedB) ? odsBuilder.getUnitAttr() : nullptr);
  }
  if (clamp) {
    odsState.getOrAddProperties<Properties>().clamp = ((clamp) ? odsBuilder.getUnitAttr() : nullptr);
  }
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void WMMAOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() == 3u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<WMMAOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void WMMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() == 3u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<WMMAOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
  ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
  if (::mlir::succeeded(WMMAOp::inferReturnTypes(odsBuilder.getContext(),
          odsState.location, operands,
          odsState.attributes.getDictionary(odsState.getContext()),
          odsState.getRawProperties(),
          odsState.regions, inferredReturnTypes))) {
    assert(inferredReturnTypes.size() == 1u && "mismatched number of return types");
    odsState.addTypes(inferredReturnTypes);
  } else {
    ::llvm::report_fatal_error("Failed to infer result type(s).");
  }
}

void WMMAOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() == 3u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void WMMAOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() == 3u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties &>(properties));
  odsState.addAttributes(discardableAttributes);

  ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
  if (::mlir::succeeded(WMMAOp::inferReturnTypes(odsBuilder.getContext(),
          odsState.location, operands,
          odsState.attributes.getDictionary(odsState.getContext()),
          odsState.getRawProperties(),
          odsState.regions, inferredReturnTypes))) {
    assert(inferredReturnTypes.size() == 1u && "mismatched number of return types");
    odsState.addTypes(inferredReturnTypes);
  } else {
    ::llvm::report_fatal_error("Failed to infer result type(s).");
  }
}

void WMMAOp::populateDefaultProperties(::mlir::OperationName opName, Properties &properties) {
  ::mlir::Builder odsBuilder(opName.getContext());
  if (!properties.subwordOffset)
    properties.subwordOffset = odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), 0);
}

::llvm::LogicalResult WMMAOp::verifyInvariantsImpl() {
  auto tblgen_clamp = getProperties().clamp; (void)tblgen_clamp;
  auto tblgen_subwordOffset = getProperties().subwordOffset; (void)tblgen_subwordOffset;
  auto tblgen_unsignedA = getProperties().unsignedA; (void)tblgen_unsignedA;
  auto tblgen_unsignedB = getProperties().unsignedB; (void)tblgen_unsignedB;

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU12(*this, tblgen_subwordOffset, "subwordOffset")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU8(*this, tblgen_unsignedA, "unsignedA")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU8(*this, tblgen_unsignedB, "unsignedB")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMDGPU8(*this, tblgen_clamp, "clamp")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU24(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU24(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup2 = getODSOperands(2);

    for (auto v : valueGroup2) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU25(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSResults(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMDGPU25(*this, v.getType(), "result", index++)))
        return ::mlir::failure();
    }
  }
  if (!((((*this->getODSOperands(2).begin()).getType()) == ((*this->getODSResults(0).begin()).getType()) && ((*this->getODSResults(0).begin()).getType()) == ((*this->getODSOperands(2).begin()).getType()))))
    return emitOpError("failed to verify that all of {destC, destD} have same type");
  return ::mlir::success();
}

::llvm::LogicalResult WMMAOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::llvm::LogicalResult WMMAOp::inferReturnTypes(::mlir::MLIRContext *context, ::std::optional<::mlir::Location> location, ::mlir::ValueRange operands, ::mlir::DictionaryAttr attributes, ::mlir::OpaqueProperties properties, ::mlir::RegionRange regions, ::llvm::SmallVectorImpl<::mlir::Type>&inferredReturnTypes) {
  inferredReturnTypes.resize(1);
  ::mlir::Builder odsBuilder(context);
  if (operands.size() <= 2)
    return ::mlir::failure();
  ::mlir::Type odsInferredType0 = operands[2].getType();
  inferredReturnTypes[0] = odsInferredType0;
  return ::mlir::success();
}

::mlir::ParseResult WMMAOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand sourceARawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> sourceAOperands(&sourceARawOperand, 1);  ::llvm::SMLoc sourceAOperandsLoc;
  (void)sourceAOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand sourceBRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> sourceBOperands(&sourceBRawOperand, 1);  ::llvm::SMLoc sourceBOperandsLoc;
  (void)sourceBOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand destCRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> destCOperands(&destCRawOperand, 1);  ::llvm::SMLoc destCOperandsLoc;
  (void)destCOperandsLoc;
  ::mlir::Type sourceARawType{};
  ::llvm::ArrayRef<::mlir::Type> sourceATypes(&sourceARawType, 1);
  ::mlir::Type sourceBRawType{};
  ::llvm::ArrayRef<::mlir::Type> sourceBTypes(&sourceBRawType, 1);
  ::mlir::Type destCRawType{};
  ::llvm::ArrayRef<::mlir::Type> destCTypes(&destCRawType, 1);

  sourceAOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(sourceARawOperand))
    return ::mlir::failure();
  if (parser.parseStar())
    return ::mlir::failure();

  sourceBOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(sourceBRawOperand))
    return ::mlir::failure();
  if (parser.parsePlus())
    return ::mlir::failure();

  destCOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(destCRawOperand))
    return ::mlir::failure();
  {
    auto loc = parser.getCurrentLocation();(void)loc;
    if (parser.parseOptionalAttrDict(result.attributes))
      return ::mlir::failure();
    if (failed(verifyInherentAttrs(result.name, result.attributes, [&]() {
        return parser.emitError(loc) << "'" << result.name.getStringRef() << "' op ";
      })))
      return ::mlir::failure();
  }
  if (parser.parseColon())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    sourceARawType = type;
  }
  if (parser.parseComma())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    sourceBRawType = type;
  }
  if (parser.parseComma())
    return ::mlir::failure();

  {
    ::mlir::Type type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    destCRawType = type;
  }
  result.addTypes(destCTypes[0]);
  if (parser.resolveOperands(sourceAOperands, sourceATypes, sourceAOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(sourceBOperands, sourceBTypes, sourceBOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(destCOperands, destCTypes, destCOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void WMMAOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  _odsPrinter << ' ';
  _odsPrinter << getSourceA();
  _odsPrinter << ' ' << "*";
  _odsPrinter << ' ';
  _odsPrinter << getSourceB();
  _odsPrinter << ' ' << "+";
  _odsPrinter << ' ';
  _odsPrinter << getDestC();
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getSubwordOffsetAttr();
     if(attr && (attr == odsBuilder.getIntegerAttr(odsBuilder.getIntegerType(32), 0)))
       elidedAttrs.push_back("subwordOffset");
  }
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getUnsignedAAttr();
     if(attr && (attr == ((false) ? odsBuilder.getUnitAttr() : nullptr)))
       elidedAttrs.push_back("unsignedA");
  }
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getUnsignedBAttr();
     if(attr && (attr == ((false) ? odsBuilder.getUnitAttr() : nullptr)))
       elidedAttrs.push_back("unsignedB");
  }
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getClampAttr();
     if(attr && (attr == ((false) ? odsBuilder.getUnitAttr() : nullptr)))
       elidedAttrs.push_back("clamp");
  }
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getSourceA().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ",";
  _odsPrinter << ' ';
  {
    auto type = getSourceB().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ",";
  _odsPrinter << ' ';
  {
    auto type = getDestC().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::Type>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
}

void WMMAOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
}

} // namespace amdgpu
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amdgpu::WMMAOp)


#endif  // GET_OP_CLASSES

