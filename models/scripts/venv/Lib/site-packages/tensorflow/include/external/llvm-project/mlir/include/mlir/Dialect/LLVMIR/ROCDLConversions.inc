if (auto op = dyn_cast<::mlir::ROCDL::BallotOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_ballot,1,{0},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::BarrierOp>(opInst)) {

    llvm::LLVMContext &llvmContext = builder.getContext();
    builder.CreateFence(llvm::AtomicOrdering::Release,
                        llvmContext.getOrInsertSyncScopeID("workgroup"));
    createIntrinsicCall(builder, llvm::Intrinsic::amdgcn_s_barrier);
    builder.CreateFence(llvm::AtomicOrdering::Acquire,
                        llvmContext.getOrInsertSyncScopeID("workgroup"));
  
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::BarrierSignalOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_s_barrier_signal,0,{},{},{0},{StringLiteral("id")});
    (void) inst;
    
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::BarrierWaitOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_s_barrier_wait,0,{},{},{0},{StringLiteral("id")});
    (void) inst;
    
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::BlockDimXOp>(opInst)) {
moduleTranslation.mapValue(op.getRes()) = createDimGetterFunctionCall(builder, op, "__ockl_get_local_size", 0);
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::BlockDimYOp>(opInst)) {
moduleTranslation.mapValue(op.getRes()) = createDimGetterFunctionCall(builder, op, "__ockl_get_local_size", 1);
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::BlockDimZOp>(opInst)) {
moduleTranslation.mapValue(op.getRes()) = createDimGetterFunctionCall(builder, op, "__ockl_get_local_size", 2);
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::BlockIdXOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_workgroup_id_x,1,{},{},{},{});
    (void) inst;
    
    if (op.getRange()) {
      inst->addRangeRetAttr(::llvm::ConstantRange(
        op.getRange()->getLower(), op.getRange()->getUpper()));
    }
  moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::BlockIdYOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_workgroup_id_y,1,{},{},{},{});
    (void) inst;
    
    if (op.getRange()) {
      inst->addRangeRetAttr(::llvm::ConstantRange(
        op.getRange()->getLower(), op.getRange()->getUpper()));
    }
  moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::BlockIdZOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_workgroup_id_z,1,{},{},{},{});
    (void) inst;
    
    if (op.getRange()) {
      inst->addRangeRetAttr(::llvm::ConstantRange(
        op.getRange()->getLower(), op.getRange()->getUpper()));
    }
  moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtF32Bf8Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_f32_bf8,1,{},{},{1},{StringLiteral("byteSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtF32Fp8Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_f32_fp8,1,{},{},{1},{StringLiteral("byteSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtPkBf8F32Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_pk_bf8_f32,1,{},{},{3},{StringLiteral("wordSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtPkF32Bf8Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_pk_f32_bf8,1,{},{},{1},{StringLiteral("wordSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtPkF32Fp8Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_pk_f32_fp8,1,{},{},{1},{StringLiteral("wordSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtPkFp8F32Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_pk_fp8_f32,1,{},{},{3},{StringLiteral("wordSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtPkRtz>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_pkrtz,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32F16Bf8Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_f16_bf8,1,{},{},{3, 4},{StringLiteral("srcSelIndex"), StringLiteral("dstLoHiSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32F16Fp8Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_f16_fp8,1,{},{},{3, 4},{StringLiteral("srcSelIndex"), StringLiteral("dstLoHiSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32F32Bf8Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_f32_bf8,1,{},{},{2},{StringLiteral("srcSelIndex")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32F32Fp8Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_f32_fp8,1,{},{},{2},{StringLiteral("srcSelIndex")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32Pk32Bf6Bf16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk32_bf6_bf16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32Pk32Bf6F16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk32_bf6_f16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32Pk32Bf16Bf6Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk32_bf16_bf6,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32Pk32Bf16Fp6Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk32_bf16_fp6,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32Pk32F16Bf6Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk32_f16_bf6,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32Pk32F16Fp6Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk32_f16_fp6,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32Pk32F32Bf6Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk32_f32_bf6,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32Pk32F32Fp6Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk32_f32_fp6,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32Pk32Fp6Bf16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk32_fp6_bf16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32Pk32Fp6F16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk32_fp6_f16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32PkBf8Bf16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk_bf8_bf16,1,{},{},{3},{StringLiteral("dstLoHiSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32PkBf8F16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk_bf8_f16,1,{},{},{3},{StringLiteral("dstLoHiSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32PkBf8F32Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk_bf8_f32,1,{},{},{4},{StringLiteral("dstLoHiSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32PkBf16Bf8Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk_bf16_bf8,1,{},{},{2},{StringLiteral("srcLoHiSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32PkBf16Fp4Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk_bf16_fp4,1,{},{},{2},{StringLiteral("srcSelIndex")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32PkBf16Fp8Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk_bf16_fp8,1,{},{},{2},{StringLiteral("srcLoHiSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32PkF16Bf8Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk_f16_bf8,1,{},{},{2},{StringLiteral("srcLoHiSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32PkF16Fp4Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk_f16_fp4,1,{},{},{2},{StringLiteral("srcSelIndex")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32PkF16Fp8Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk_f16_fp8,1,{},{},{2},{StringLiteral("srcLoHiSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32PkF32Bf8Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk_f32_bf8,1,{},{},{2},{StringLiteral("srcLoHiSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32PkF32Fp4Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk_f32_fp4,1,{},{},{2},{StringLiteral("srcSelIndex")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32PkF32Fp8Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk_f32_fp8,1,{},{},{2},{StringLiteral("srcLoHiSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32PkFp4Bf16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk_fp4_bf16,1,{},{},{3},{StringLiteral("dstSelIndex")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32PkFp4F16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk_fp4_f16,1,{},{},{3},{StringLiteral("dstSelIndex")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32PkFp4F32Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk_fp4_f32,1,{},{},{4},{StringLiteral("dstSelIndex")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32PkFp8Bf16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk_fp8_bf16,1,{},{},{3},{StringLiteral("dstLoHiSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32PkFp8F16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk_fp8_f16,1,{},{},{3},{StringLiteral("dstLoHiSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32PkFp8F32Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_pk_fp8_f32,1,{},{},{4},{StringLiteral("dstLoHiSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32SrBf8BF16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_sr_bf8_bf16,1,{},{},{4},{StringLiteral("dstSelIndex")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32SrBf8F16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_sr_bf8_f16,1,{},{},{4},{StringLiteral("dstSelIndex")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32SrBf8F32Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_sr_bf8_f32,1,{},{},{4},{StringLiteral("dstSelIndex")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32SrFp8BF16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_sr_fp8_bf16,1,{},{},{4},{StringLiteral("dstSelIndex")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32SrFp8F16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_sr_fp8_f16,1,{},{},{4},{StringLiteral("dstSelIndex")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32SrFp8F32Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_sr_fp8_f32,1,{},{},{4},{StringLiteral("dstSelIndex")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32SrPk32Bf6Bf16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_sr_pk32_bf6_bf16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32SrPk32Bf6F16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_sr_pk32_bf6_f16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32SrPk32Bf6F32Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_sr_pk32_bf6_f32,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32SrPk32Fp6Bf16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_sr_pk32_fp6_bf16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32SrPk32Fp6F16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_sr_pk32_fp6_f16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32SrPk32Fp6F32Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_sr_pk32_fp6_f32,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32SrPkFp4Bf16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_sr_pk_fp4_bf16,1,{},{},{4},{StringLiteral("dstSelIndex")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32SrPkFp4F16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_sr_pk_fp4_f16,1,{},{},{4},{StringLiteral("dstSelIndex")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF32SrPkFp4F32Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_sr_pk_fp4_f32,1,{},{},{4},{StringLiteral("dstSelIndex")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF322xPk16Bf6F32Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_2xpk16_bf6_f32,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtScaleF322xPk16Fp6F32Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_scalef32_2xpk16_fp6_f32,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtSrBf8F32Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_sr_bf8_f32,1,{},{},{3},{StringLiteral("byteSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::CvtSrFp8F32Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_cvt_sr_fp8_f32,1,{},{},{3},{StringLiteral("byteSel")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::DPPUpdateOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_update_dpp,1,{},{0},{2, 3, 4, 5},{StringLiteral("dppCtrl"), StringLiteral("rowMask"), StringLiteral("bankMask"), StringLiteral("boundCtrl")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::DsBpermuteOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_ds_bpermute,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::DsSwizzleOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_ds_swizzle,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::GlobalLoadLDSOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_global_load_lds,0,{},{},{2, 3, 4},{StringLiteral("size"), StringLiteral("offset"), StringLiteral("aux")});
    (void) inst;
    
    moduleTranslation.setAliasScopeMetadata(op, inst);
    moduleTranslation.setTBAAMetadata(op, inst);
  
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::GridDimXOp>(opInst)) {
moduleTranslation.mapValue(op.getRes()) = createDimGetterFunctionCall(builder, op, "__ockl_get_num_groups", 0);
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::GridDimYOp>(opInst)) {
moduleTranslation.mapValue(op.getRes()) = createDimGetterFunctionCall(builder, op, "__ockl_get_num_groups", 1);
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::GridDimZOp>(opInst)) {
moduleTranslation.mapValue(op.getRes()) = createDimGetterFunctionCall(builder, op, "__ockl_get_num_groups", 2);
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::IglpOpt>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_iglp_opt,0,{},{},{0},{StringLiteral("variant")});
    (void) inst;
    
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::LoadToLDSOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_load_to_lds,0,{},{0},{2, 3, 4},{StringLiteral("size"), StringLiteral("offset"), StringLiteral("aux")});
    (void) inst;
    
    moduleTranslation.setAliasScopeMetadata(op, inst);
    moduleTranslation.setTBAAMetadata(op, inst);
  
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::MakeBufferRsrcOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_make_buffer_rsrc,1,{0},{0},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::MbcntHiOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mbcnt_hi,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::MbcntLoOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mbcnt_lo,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::PermlaneX16Op>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_permlanex16,1,{},{0},{4, 5},{StringLiteral("fi"), StringLiteral("boundControl")});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::RawBufferAtomicCmpSwap>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_raw_buffer_atomic_cmpswap,1,{},{0},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::RawBufferAtomicFAddOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_raw_buffer_atomic_fadd,0,{},{0},{},{});
    (void) inst;
    
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::RawBufferAtomicFMaxOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_raw_buffer_atomic_fmax,0,{},{0},{},{});
    (void) inst;
    
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::RawBufferAtomicSMaxOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_raw_buffer_atomic_smax,0,{},{0},{},{});
    (void) inst;
    
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::RawBufferAtomicUMinOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_raw_buffer_atomic_umin,0,{},{0},{},{});
    (void) inst;
    
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::RawBufferLoadOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_raw_buffer_load,1,{0},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::RawBufferStoreOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_raw_buffer_store,0,{},{0},{},{});
    (void) inst;
    
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::RawPtrBufferAtomicCmpSwap>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_raw_ptr_buffer_atomic_cmpswap,1,{0},{},{},{});
    (void) inst;
    
    moduleTranslation.setAliasScopeMetadata(op, inst);
    moduleTranslation.setTBAAMetadata(op, inst);
  moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::RawPtrBufferAtomicFaddOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_raw_ptr_buffer_atomic_fadd,0,{},{0},{},{});
    (void) inst;
    
    moduleTranslation.setAliasScopeMetadata(op, inst);
    moduleTranslation.setTBAAMetadata(op, inst);
  
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::RawPtrBufferAtomicFmaxOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_raw_ptr_buffer_atomic_fmax,0,{},{0},{},{});
    (void) inst;
    
    moduleTranslation.setAliasScopeMetadata(op, inst);
    moduleTranslation.setTBAAMetadata(op, inst);
  
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::RawPtrBufferAtomicSmaxOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_raw_ptr_buffer_atomic_smax,0,{},{0},{},{});
    (void) inst;
    
    moduleTranslation.setAliasScopeMetadata(op, inst);
    moduleTranslation.setTBAAMetadata(op, inst);
  
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::RawPtrBufferAtomicUminOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_raw_ptr_buffer_atomic_umin,0,{},{0},{},{});
    (void) inst;
    
    moduleTranslation.setAliasScopeMetadata(op, inst);
    moduleTranslation.setTBAAMetadata(op, inst);
  
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::RawPtrBufferLoadLdsOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_raw_ptr_buffer_load_lds,0,{},{},{},{});
    (void) inst;
    
    moduleTranslation.setAliasScopeMetadata(op, inst);
    moduleTranslation.setTBAAMetadata(op, inst);
  
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::RawPtrBufferLoadOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_raw_ptr_buffer_load,1,{0},{},{},{});
    (void) inst;
    
    moduleTranslation.setAliasScopeMetadata(op, inst);
    moduleTranslation.setTBAAMetadata(op, inst);
  moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::RawPtrBufferStoreOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_raw_ptr_buffer_store,0,{},{0},{},{});
    (void) inst;
    
    moduleTranslation.setAliasScopeMetadata(op, inst);
    moduleTranslation.setTBAAMetadata(op, inst);
  
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::ReadlaneOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_readlane,1,{},{0},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::SBarrierOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_s_barrier,0,{},{},{},{});
    (void) inst;
    
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::SWaitcntOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_s_waitcnt,0,{},{},{0},{StringLiteral("bitfield")});
    (void) inst;
    
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::SchedBarrier>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_sched_barrier,0,{},{},{0},{StringLiteral("mask")});
    (void) inst;
    
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::SchedGroupBarrier>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_sched_group_barrier,0,{},{},{0, 1, 2},{StringLiteral("mask"), StringLiteral("size"), StringLiteral("groupId")});
    (void) inst;
    
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::SetPrioOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_s_setprio,0,{},{},{0},{StringLiteral("priority")});
    (void) inst;
    
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::ThreadIdXOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_workitem_id_x,1,{},{},{},{});
    (void) inst;
    
    if (op.getRange()) {
      inst->addRangeRetAttr(::llvm::ConstantRange(
        op.getRange()->getLower(), op.getRange()->getUpper()));
    }
  moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::ThreadIdYOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_workitem_id_y,1,{},{},{},{});
    (void) inst;
    
    if (op.getRange()) {
      inst->addRangeRetAttr(::llvm::ConstantRange(
        op.getRange()->getLower(), op.getRange()->getUpper()));
    }
  moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::ThreadIdZOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_workitem_id_z,1,{},{},{},{});
    (void) inst;
    
    if (op.getRange()) {
      inst->addRangeRetAttr(::llvm::ConstantRange(
        op.getRange()->getLower(), op.getRange()->getUpper()));
    }
  moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::WaitDscntOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_s_wait_dscnt,0,{},{},{0},{StringLiteral("id")});
    (void) inst;
    
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::WavefrontSizeOp>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_wavefrontsize,1,{},{},{},{});
    (void) inst;
    
    if (op.getRange()) {
      inst->addRangeRetAttr(::llvm::ConstantRange(
        op.getRange()->getLower(), op.getRange()->getUpper()));
    }
  moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::ds_read_tr4_b64>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_ds_read_tr4_b64,1,{1},{},{},{});
    (void) inst;
    
    moduleTranslation.setAliasScopeMetadata(op, inst);
    moduleTranslation.setTBAAMetadata(op, inst);
  moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::ds_read_tr6_b96>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_ds_read_tr6_b96,1,{1},{},{},{});
    (void) inst;
    
    moduleTranslation.setAliasScopeMetadata(op, inst);
    moduleTranslation.setTBAAMetadata(op, inst);
  moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::ds_read_tr8_b64>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_ds_read_tr8_b64,1,{1},{},{},{});
    (void) inst;
    
    moduleTranslation.setAliasScopeMetadata(op, inst);
    moduleTranslation.setTBAAMetadata(op, inst);
  moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::ds_read_tr16_b64>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_ds_read_tr16_b64,1,{1},{},{},{});
    (void) inst;
    
    moduleTranslation.setAliasScopeMetadata(op, inst);
    moduleTranslation.setTBAAMetadata(op, inst);
  moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_4x4x1f32>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_4x4x1f32,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_4x4x2bf16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_4x4x2bf16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_4x4x4bf16_1k>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_4x4x4bf16_1k,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_4x4x4f16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_4x4x4f16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_16x16x1f32>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_16x16x1f32,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_16x16x2bf16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_16x16x2bf16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_16x16x4bf16_1k>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_16x16x4bf16_1k,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_16x16x4f16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_16x16x4f16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_16x16x4f32>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_16x16x4f32,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_16x16x8_xf32>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_16x16x8_xf32,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_16x16x8bf16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_16x16x8bf16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_16x16x16bf16_1k>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_16x16x16bf16_1k,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_16x16x16f16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_16x16x16f16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_16x16x32_bf8_bf8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_16x16x32_bf8_bf8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_16x16x32_bf8_fp8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_16x16x32_bf8_fp8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_16x16x32_bf16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_16x16x32_bf16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_16x16x32_f16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_16x16x32_f16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_16x16x32_fp8_bf8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_16x16x32_fp8_bf8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_16x16x32_fp8_fp8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_16x16x32_fp8_fp8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_32x32x1f32>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_32x32x1f32,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_32x32x2bf16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_32x32x2bf16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_32x32x2f32>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_32x32x2f32,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_32x32x4_xf32>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_32x32x4_xf32,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_32x32x4bf16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_32x32x4bf16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_32x32x4bf16_1k>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_32x32x4bf16_1k,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_32x32x4f16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_32x32x4f16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_32x32x8bf16_1k>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_32x32x8bf16_1k,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_32x32x8f16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_32x32x8f16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_32x32x16_bf8_bf8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_32x32x16_bf8_bf8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_32x32x16_bf8_fp8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_32x32x16_bf8_fp8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_32x32x16_bf16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_32x32x16_bf16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_32x32x16_f16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_32x32x16_f16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_32x32x16_fp8_bf8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_32x32x16_fp8_bf8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f32_32x32x16_fp8_fp8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f32_32x32x16_fp8_fp8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f64_4x4x4f64>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f64_4x4x4f64,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_f64_16x16x4f64>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_f64_16x16x4f64,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_i32_4x4x4i8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_i32_4x4x4i8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_i32_16x16x4i8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_i32_16x16x4i8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_i32_16x16x16i8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_i32_16x16x16i8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_i32_16x16x32_i8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_i32_16x16x32_i8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_i32_16x16x64_i8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_i32_16x16x64_i8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_i32_32x32x4i8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_i32_32x32x4i8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_i32_32x32x8i8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_i32_32x32x8i8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_i32_32x32x16_i8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_i32_32x32x16_i8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_i32_32x32x32_i8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_i32_32x32x32_i8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_scale_f32_16x16x128_f8f6f4>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_scale_f32_16x16x128_f8f6f4,1,{},{0, 1},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::mfma_scale_f32_32x32x64_f8f6f4>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_mfma_scale_f32_32x32x64_f8f6f4,1,{},{0, 1},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::smfmac_f32_16x16x32_bf16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_smfmac_f32_16x16x32_bf16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::smfmac_f32_16x16x32_f16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_smfmac_f32_16x16x32_f16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::smfmac_f32_16x16x64_bf8_bf8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_smfmac_f32_16x16x64_bf8_bf8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::smfmac_f32_16x16x64_bf8_fp8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_smfmac_f32_16x16x64_bf8_fp8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::smfmac_f32_16x16x64_fp8_bf8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_smfmac_f32_16x16x64_fp8_bf8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::smfmac_f32_16x16x64_fp8_fp8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_smfmac_f32_16x16x64_fp8_fp8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::smfmac_f32_32x32x16_bf16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_smfmac_f32_32x32x16_bf16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::smfmac_f32_32x32x16_f16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_smfmac_f32_32x32x16_f16,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::smfmac_f32_32x32x32_bf8_bf8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_smfmac_f32_32x32x32_bf8_bf8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::smfmac_f32_32x32x32_bf8_fp8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_smfmac_f32_32x32x32_bf8_fp8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::smfmac_f32_32x32x32_fp8_bf8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_smfmac_f32_32x32x32_fp8_bf8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::smfmac_f32_32x32x32_fp8_fp8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_smfmac_f32_32x32x32_fp8_fp8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::smfmac_i32_16x16x64_i8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_smfmac_i32_16x16x64_i8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::smfmac_i32_32x32x32_i8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_smfmac_i32_32x32x32_i8,1,{},{},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::wmma_bf16_16x16x16_bf16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_wmma_bf16_16x16x16_bf16,1,{0},{0},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::wmma_f16_16x16x16_f16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_wmma_f16_16x16x16_f16,1,{0},{0},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::wmma_f32_16x16x16_bf8_bf8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_wmma_f32_16x16x16_bf8_bf8,1,{0},{1},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::wmma_f32_16x16x16_bf8_fp8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_wmma_f32_16x16x16_bf8_fp8,1,{0},{1},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::wmma_f32_16x16x16_bf16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_wmma_f32_16x16x16_bf16,1,{0},{0},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::wmma_f32_16x16x16_f16>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_wmma_f32_16x16x16_f16,1,{0},{0},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::wmma_f32_16x16x16_fp8_bf8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_wmma_f32_16x16x16_fp8_bf8,1,{0},{1},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::wmma_f32_16x16x16_fp8_fp8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_wmma_f32_16x16x16_fp8_fp8,1,{0},{1},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::wmma_i32_16x16x16_iu4>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_wmma_i32_16x16x16_iu4,1,{0},{1},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::wmma_i32_16x16x16_iu8>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_wmma_i32_16x16x16_iu8,1,{0},{1},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
if (auto op = dyn_cast<::mlir::ROCDL::wmma_i32_16x16x32_iu4>(opInst)) {

    auto *inst = LLVM::detail::createIntrinsicCall(
      builder, moduleTranslation, &opInst, llvm::Intrinsic::amdgcn_wmma_i32_16x16x32_iu4,1,{0},{1},{},{});
    (void) inst;
    moduleTranslation.mapValue(op.getRes()) = inst;
  return success();
}
