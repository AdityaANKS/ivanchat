/*===- TableGen'erated file -------------------------------------*- C++ -*-===*\
|*                                                                            *|
|* Op Definitions                                                             *|
|*                                                                            *|
|* Automatically generated file, do not edit!                                 *|
|* From: LinalgRelayoutOps.td                                                 *|
|*                                                                            *|
\*===----------------------------------------------------------------------===*/

#ifdef GET_OP_LIST
#undef GET_OP_LIST

::mlir::linalg::PackOp,
::mlir::linalg::UnPackOp
#endif  // GET_OP_LIST

#ifdef GET_OP_CLASSES
#undef GET_OP_CLASSES


//===----------------------------------------------------------------------===//
// Local Utility Method Definitions
//===----------------------------------------------------------------------===//

namespace mlir {
namespace linalg {

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_LinalgRelayoutOps1(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!(((::llvm::isa<::mlir::RankedTensorType>(type))) && ([](::mlir::Type elementType) { return (true); }(::llvm::cast<::mlir::ShapedType>(type).getElementType())))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be ranked tensor of any type values, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_LinalgRelayoutOps2(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!((true))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be any type, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_LinalgRelayoutOps3(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!((::llvm::isa<::mlir::IndexType>(type)))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be variadic of index, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_LinalgRelayoutOps1(
    ::mlir::Attribute attr, ::llvm::StringRef attrName, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  if (attr && !((::llvm::isa<::mlir::DenseI64ArrayAttr>(attr))))
    return emitError() << "attribute '" << attrName
        << "' failed to satisfy constraint: i64 dense array attribute";
  return ::mlir::success();
}
static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_LinalgRelayoutOps1(
    ::mlir::Operation *op, ::mlir::Attribute attr, ::llvm::StringRef attrName) {
  return __mlir_ods_local_attr_constraint_LinalgRelayoutOps1(attr, attrName, [op]() {
    return op->emitOpError();
  });
}
} // namespace linalg
} // namespace mlir
namespace mlir {
namespace linalg {

//===----------------------------------------------------------------------===//
// ::mlir::linalg::PackOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
PackOpGenericAdaptorBase::PackOpGenericAdaptorBase(PackOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

std::pair<unsigned, unsigned> PackOpGenericAdaptorBase::getODSOperandIndexAndLength(unsigned index, unsigned odsOperandsSize) {
  ::llvm::ArrayRef<int32_t> sizeAttr = getProperties().operandSegmentSizes;

  unsigned start = 0;
  for (unsigned i = 0; i < index; ++i)
    start += sizeAttr[i];
  return {start, sizeAttr[index]};
}

::mlir::DenseI64ArrayAttr PackOpGenericAdaptorBase::getOuterDimsPermAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::DenseI64ArrayAttr>(getProperties().outer_dims_perm);
  if (!attr)
    attr = ::mlir::Builder(odsAttrs.getContext()).getDenseI64ArrayAttr({});
  return attr;
}

::llvm::ArrayRef<int64_t> PackOpGenericAdaptorBase::getOuterDimsPerm() {
  auto attr = getOuterDimsPermAttr();
    if (!attr)
      return ::mlir::Builder(odsAttrs.getContext()).getDenseI64ArrayAttr({});
  return attr;
}

::llvm::ArrayRef<int64_t> PackOpGenericAdaptorBase::getInnerDimsPos() {
  auto attr = getInnerDimsPosAttr();
  return attr;
}

::llvm::ArrayRef<int64_t> PackOpGenericAdaptorBase::getStaticInnerTiles() {
  auto attr = getStaticInnerTilesAttr();
  return attr;
}

} // namespace detail
PackOpAdaptor::PackOpAdaptor(PackOp op) : PackOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult PackOpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_inner_dims_pos = getProperties().inner_dims_pos; (void)tblgen_inner_dims_pos;
  if (!tblgen_inner_dims_pos) return emitError(loc, "'linalg.pack' op ""requires attribute 'inner_dims_pos'");
  auto tblgen_outer_dims_perm = getProperties().outer_dims_perm; (void)tblgen_outer_dims_perm;
  auto tblgen_static_inner_tiles = getProperties().static_inner_tiles; (void)tblgen_static_inner_tiles;
  if (!tblgen_static_inner_tiles) return emitError(loc, "'linalg.pack' op ""requires attribute 'static_inner_tiles'");

  if (tblgen_outer_dims_perm && !((::llvm::isa<::mlir::DenseI64ArrayAttr>(tblgen_outer_dims_perm))))
    return emitError(loc, "'linalg.pack' op ""attribute 'outer_dims_perm' failed to satisfy constraint: i64 dense array attribute");

  if (tblgen_inner_dims_pos && !((::llvm::isa<::mlir::DenseI64ArrayAttr>(tblgen_inner_dims_pos))))
    return emitError(loc, "'linalg.pack' op ""attribute 'inner_dims_pos' failed to satisfy constraint: i64 dense array attribute");

  if (tblgen_static_inner_tiles && !((::llvm::isa<::mlir::DenseI64ArrayAttr>(tblgen_static_inner_tiles))))
    return emitError(loc, "'linalg.pack' op ""attribute 'static_inner_tiles' failed to satisfy constraint: i64 dense array attribute");
  return ::mlir::success();
}

std::pair<unsigned, unsigned> PackOp::getODSOperandIndexAndLength(unsigned index) {
  ::llvm::ArrayRef<int32_t> sizeAttr = getProperties().operandSegmentSizes;

  unsigned start = 0;
  for (unsigned i = 0; i < index; ++i)
    start += sizeAttr[i];
  return {start, sizeAttr[index]};
}

::mlir::MutableOperandRange PackOp::getPaddingValueMutable() {
  auto range = getODSOperandIndexAndLength(2);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second, ::mlir::MutableOperandRange::OperandSegment(2u, {getOperandSegmentSizesAttrName(), ::mlir::DenseI32ArrayAttr::get(getContext(), getProperties().operandSegmentSizes)}));
  return mutableRange;
}

::mlir::MutableOperandRange PackOp::getInnerTilesMutable() {
  auto range = getODSOperandIndexAndLength(3);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second, ::mlir::MutableOperandRange::OperandSegment(3u, {getOperandSegmentSizesAttrName(), ::mlir::DenseI32ArrayAttr::get(getContext(), getProperties().operandSegmentSizes)}));
  return mutableRange;
}

::llvm::LogicalResult PackOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.inner_dims_pos;
       auto attr = dict.get("inner_dims_pos");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `inner_dims_pos` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.outer_dims_perm;
       auto attr = dict.get("outer_dims_perm");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `outer_dims_perm` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.static_inner_tiles;
       auto attr = dict.get("static_inner_tiles");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `static_inner_tiles` in property conversion: " << attr;
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

::mlir::Attribute PackOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.inner_dims_pos;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("inner_dims_pos",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.outer_dims_perm;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("outer_dims_perm",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.static_inner_tiles;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("static_inner_tiles",
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

llvm::hash_code PackOp::computePropertiesHash(const Properties &prop) {
  auto hash_operandSegmentSizes = [] (const auto &propStorage) -> llvm::hash_code {
    using ::llvm::hash_value;
    return ::llvm::hash_combine_range(std::begin(propStorage), std::end(propStorage));;
  };
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.inner_dims_pos.getAsOpaquePointer()), 
    llvm::hash_value(prop.outer_dims_perm.getAsOpaquePointer()), 
    llvm::hash_value(prop.static_inner_tiles.getAsOpaquePointer()), 
    hash_operandSegmentSizes(prop.operandSegmentSizes));
}

std::optional<mlir::Attribute> PackOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "inner_dims_pos")
      return prop.inner_dims_pos;

    if (name == "outer_dims_perm")
      return prop.outer_dims_perm;

    if (name == "static_inner_tiles")
      return prop.static_inner_tiles;
    if (name == "operand_segment_sizes" || name == "operandSegmentSizes") return [&]() -> ::mlir::Attribute { return ::mlir::DenseI32ArrayAttr::get(ctx, prop.operandSegmentSizes); }();
  return std::nullopt;
}

void PackOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "inner_dims_pos") {
       prop.inner_dims_pos = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.inner_dims_pos)>>(value);
       return;
    }

    if (name == "outer_dims_perm") {
       prop.outer_dims_perm = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.outer_dims_perm)>>(value);
       return;
    }

    if (name == "static_inner_tiles") {
       prop.static_inner_tiles = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.static_inner_tiles)>>(value);
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

void PackOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.inner_dims_pos) attrs.append("inner_dims_pos", prop.inner_dims_pos);

    if (prop.outer_dims_perm) attrs.append("outer_dims_perm", prop.outer_dims_perm);

    if (prop.static_inner_tiles) attrs.append("static_inner_tiles", prop.static_inner_tiles);
  attrs.append("operandSegmentSizes", [&]() -> ::mlir::Attribute { return ::mlir::DenseI32ArrayAttr::get(ctx, prop.operandSegmentSizes); }());
}

::llvm::LogicalResult PackOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getInnerDimsPosAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_LinalgRelayoutOps1(attr, "inner_dims_pos", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getOuterDimsPermAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_LinalgRelayoutOps1(attr, "outer_dims_perm", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getStaticInnerTilesAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_LinalgRelayoutOps1(attr, "static_inner_tiles", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult PackOp::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readAttribute(prop.inner_dims_pos)))
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

  if (::mlir::failed(reader.readOptionalAttribute(prop.outer_dims_perm)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readAttribute(prop.static_inner_tiles)))
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

void PackOp::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;
  writer.writeAttribute(prop.inner_dims_pos);

if (writer.getBytecodeVersion() < /*kNativePropertiesODSSegmentSize=*/6) {
  auto &propStorage = prop.operandSegmentSizes;
  writer.writeAttribute(::mlir::DenseI32ArrayAttr::get(this->getContext(), propStorage));
}

  writer.writeOptionalAttribute(prop.outer_dims_perm);
  writer.writeAttribute(prop.static_inner_tiles);

  {
    auto &propStorage = prop.operandSegmentSizes;

  if (writer.getBytecodeVersion() >= /*kNativePropertiesODSSegmentSize=*/6)
    writer.writeSparseArray(::llvm::ArrayRef(propStorage));
;
  }
}

::llvm::ArrayRef<int64_t> PackOp::getOuterDimsPerm() {
  auto attr = getOuterDimsPermAttr();
    if (!attr)
      return ::mlir::Builder((*this)->getContext()).getDenseI64ArrayAttr({});
  return attr;
}

::llvm::ArrayRef<int64_t> PackOp::getInnerDimsPos() {
  auto attr = getInnerDimsPosAttr();
  return attr;
}

::llvm::ArrayRef<int64_t> PackOp::getStaticInnerTiles() {
  auto attr = getStaticInnerTilesAttr();
  return attr;
}

void PackOp::setOuterDimsPerm(::std::optional<::llvm::ArrayRef<int64_t>> attrValue) {
    auto &odsProp = getProperties().outer_dims_perm;
    if (attrValue)
      odsProp = ::mlir::Builder((*this)->getContext()).getDenseI64ArrayAttr(*attrValue);
    else
      odsProp = nullptr;
}

void PackOp::setInnerDimsPos(::llvm::ArrayRef<int64_t> attrValue) {
  getProperties().inner_dims_pos = ::mlir::Builder((*this)->getContext()).getDenseI64ArrayAttr(attrValue);
}

void PackOp::setStaticInnerTiles(::llvm::ArrayRef<int64_t> attrValue) {
  getProperties().static_inner_tiles = ::mlir::Builder((*this)->getContext()).getDenseI64ArrayAttr(attrValue);
}

void PackOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type result, ::mlir::Value source, ::mlir::Value dest, /*optional*/::mlir::Value padding_value, /*optional*/::mlir::DenseI64ArrayAttr outer_dims_perm, ::mlir::DenseI64ArrayAttr inner_dims_pos, ::mlir::ValueRange inner_tiles, ::mlir::DenseI64ArrayAttr static_inner_tiles) {
  odsState.addOperands(source);
  odsState.addOperands(dest);
  if (padding_value)
    odsState.addOperands(padding_value);
  odsState.addOperands(inner_tiles);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, (padding_value ? 1 : 0), static_cast<int32_t>(inner_tiles.size())}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  if (outer_dims_perm) {
    odsState.getOrAddProperties<Properties>().outer_dims_perm = outer_dims_perm;
  }
  odsState.getOrAddProperties<Properties>().inner_dims_pos = inner_dims_pos;
  odsState.getOrAddProperties<Properties>().static_inner_tiles = static_inner_tiles;
  odsState.addTypes(result);
}

void PackOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value source, ::mlir::Value dest, /*optional*/::mlir::Value padding_value, /*optional*/::mlir::DenseI64ArrayAttr outer_dims_perm, ::mlir::DenseI64ArrayAttr inner_dims_pos, ::mlir::ValueRange inner_tiles, ::mlir::DenseI64ArrayAttr static_inner_tiles) {
  odsState.addOperands(source);
  odsState.addOperands(dest);
  if (padding_value)
    odsState.addOperands(padding_value);
  odsState.addOperands(inner_tiles);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, (padding_value ? 1 : 0), static_cast<int32_t>(inner_tiles.size())}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  if (outer_dims_perm) {
    odsState.getOrAddProperties<Properties>().outer_dims_perm = outer_dims_perm;
  }
  odsState.getOrAddProperties<Properties>().inner_dims_pos = inner_dims_pos;
  odsState.getOrAddProperties<Properties>().static_inner_tiles = static_inner_tiles;

        ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
        if (::mlir::succeeded(PackOp::inferReturnTypes(odsBuilder.getContext(),
                      odsState.location, odsState.operands,
                      odsState.attributes.getDictionary(odsState.getContext()),
                      odsState.getRawProperties(),
                      odsState.regions, inferredReturnTypes)))
          odsState.addTypes(inferredReturnTypes);
        else
          ::mlir::detail::reportFatalInferReturnTypesError(odsState);
        
}

void PackOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value source, ::mlir::Value dest, /*optional*/::mlir::Value padding_value, /*optional*/::mlir::DenseI64ArrayAttr outer_dims_perm, ::mlir::DenseI64ArrayAttr inner_dims_pos, ::mlir::ValueRange inner_tiles, ::mlir::DenseI64ArrayAttr static_inner_tiles) {
  odsState.addOperands(source);
  odsState.addOperands(dest);
  if (padding_value)
    odsState.addOperands(padding_value);
  odsState.addOperands(inner_tiles);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, (padding_value ? 1 : 0), static_cast<int32_t>(inner_tiles.size())}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  if (outer_dims_perm) {
    odsState.getOrAddProperties<Properties>().outer_dims_perm = outer_dims_perm;
  }
  odsState.getOrAddProperties<Properties>().inner_dims_pos = inner_dims_pos;
  odsState.getOrAddProperties<Properties>().static_inner_tiles = static_inner_tiles;
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void PackOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type result, ::mlir::Value source, ::mlir::Value dest, /*optional*/::mlir::Value padding_value, /*optional*/::llvm::ArrayRef<int64_t> outer_dims_perm, ::llvm::ArrayRef<int64_t> inner_dims_pos, ::mlir::ValueRange inner_tiles, ::llvm::ArrayRef<int64_t> static_inner_tiles) {
  odsState.addOperands(source);
  odsState.addOperands(dest);
  if (padding_value)
    odsState.addOperands(padding_value);
  odsState.addOperands(inner_tiles);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, (padding_value ? 1 : 0), static_cast<int32_t>(inner_tiles.size())}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().outer_dims_perm = odsBuilder.getDenseI64ArrayAttr(outer_dims_perm);
  odsState.getOrAddProperties<Properties>().inner_dims_pos = odsBuilder.getDenseI64ArrayAttr(inner_dims_pos);
  odsState.getOrAddProperties<Properties>().static_inner_tiles = odsBuilder.getDenseI64ArrayAttr(static_inner_tiles);
  odsState.addTypes(result);
}

void PackOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value source, ::mlir::Value dest, /*optional*/::mlir::Value padding_value, /*optional*/::llvm::ArrayRef<int64_t> outer_dims_perm, ::llvm::ArrayRef<int64_t> inner_dims_pos, ::mlir::ValueRange inner_tiles, ::llvm::ArrayRef<int64_t> static_inner_tiles) {
  odsState.addOperands(source);
  odsState.addOperands(dest);
  if (padding_value)
    odsState.addOperands(padding_value);
  odsState.addOperands(inner_tiles);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, (padding_value ? 1 : 0), static_cast<int32_t>(inner_tiles.size())}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().outer_dims_perm = odsBuilder.getDenseI64ArrayAttr(outer_dims_perm);
  odsState.getOrAddProperties<Properties>().inner_dims_pos = odsBuilder.getDenseI64ArrayAttr(inner_dims_pos);
  odsState.getOrAddProperties<Properties>().static_inner_tiles = odsBuilder.getDenseI64ArrayAttr(static_inner_tiles);

        ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
        if (::mlir::succeeded(PackOp::inferReturnTypes(odsBuilder.getContext(),
                      odsState.location, odsState.operands,
                      odsState.attributes.getDictionary(odsState.getContext()),
                      odsState.getRawProperties(),
                      odsState.regions, inferredReturnTypes)))
          odsState.addTypes(inferredReturnTypes);
        else
          ::mlir::detail::reportFatalInferReturnTypesError(odsState);
        
}

void PackOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value source, ::mlir::Value dest, /*optional*/::mlir::Value padding_value, /*optional*/::llvm::ArrayRef<int64_t> outer_dims_perm, ::llvm::ArrayRef<int64_t> inner_dims_pos, ::mlir::ValueRange inner_tiles, ::llvm::ArrayRef<int64_t> static_inner_tiles) {
  odsState.addOperands(source);
  odsState.addOperands(dest);
  if (padding_value)
    odsState.addOperands(padding_value);
  odsState.addOperands(inner_tiles);
  ::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, (padding_value ? 1 : 0), static_cast<int32_t>(inner_tiles.size())}), odsState.getOrAddProperties<Properties>().operandSegmentSizes.begin());
  odsState.getOrAddProperties<Properties>().outer_dims_perm = odsBuilder.getDenseI64ArrayAttr(outer_dims_perm);
  odsState.getOrAddProperties<Properties>().inner_dims_pos = odsBuilder.getDenseI64ArrayAttr(inner_dims_pos);
  odsState.getOrAddProperties<Properties>().static_inner_tiles = odsBuilder.getDenseI64ArrayAttr(static_inner_tiles);
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void PackOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<PackOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void PackOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<PackOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
  ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
  if (::mlir::succeeded(PackOp::inferReturnTypes(odsBuilder.getContext(),
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

void PackOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void PackOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties &>(properties));
  odsState.addAttributes(discardableAttributes);

  ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
  if (::mlir::succeeded(PackOp::inferReturnTypes(odsBuilder.getContext(),
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

::llvm::LogicalResult PackOp::verifyInvariantsImpl() {
  auto tblgen_inner_dims_pos = getProperties().inner_dims_pos; (void)tblgen_inner_dims_pos;
  if (!tblgen_inner_dims_pos) return emitOpError("requires attribute 'inner_dims_pos'");
  auto tblgen_outer_dims_perm = getProperties().outer_dims_perm; (void)tblgen_outer_dims_perm;
  auto tblgen_static_inner_tiles = getProperties().static_inner_tiles; (void)tblgen_static_inner_tiles;
  if (!tblgen_static_inner_tiles) return emitOpError("requires attribute 'static_inner_tiles'");

  if (::mlir::failed(__mlir_ods_local_attr_constraint_LinalgRelayoutOps1(*this, tblgen_outer_dims_perm, "outer_dims_perm")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_LinalgRelayoutOps1(*this, tblgen_inner_dims_pos, "inner_dims_pos")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_LinalgRelayoutOps1(*this, tblgen_static_inner_tiles, "static_inner_tiles")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_LinalgRelayoutOps1(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_LinalgRelayoutOps1(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup2 = getODSOperands(2);

    if (valueGroup2.size() > 1) {
      return emitOpError("operand group starting at #") << index
          << " requires 0 or 1 element, but found " << valueGroup2.size();
    }

    for (auto v : valueGroup2) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_LinalgRelayoutOps2(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup3 = getODSOperands(3);

    for (auto v : valueGroup3) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_LinalgRelayoutOps3(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSResults(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_LinalgRelayoutOps1(*this, v.getType(), "result", index++)))
        return ::mlir::failure();
    }
  }
  if (!((std::equal_to<>()((*this->getODSOperands(1).begin()).getType(), (*this->getODSResults(0).begin()).getType()))))
    return emitOpError("failed to verify that result type matches type of dest");
  return ::mlir::success();
}

::llvm::LogicalResult PackOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

void PackOp::getCanonicalizationPatterns(::mlir::RewritePatternSet &results, ::mlir::MLIRContext *context) {
  results.add(canonicalize);
}

::llvm::LogicalResult PackOp::inferReturnTypes(::mlir::MLIRContext *context, ::std::optional<::mlir::Location> location, ::mlir::ValueRange operands, ::mlir::DictionaryAttr attributes, ::mlir::OpaqueProperties properties, ::mlir::RegionRange regions, ::llvm::SmallVectorImpl<::mlir::Type>&inferredReturnTypes) {
  inferredReturnTypes.resize(1);
  ::mlir::Builder odsBuilder(context);
  if (operands.size() <= 1)
    return ::mlir::failure();
  ::mlir::Type odsInferredType0 = operands[1].getType();
  inferredReturnTypes[0] = odsInferredType0;
  return ::mlir::success();
}

::mlir::ParseResult PackOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand sourceRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> sourceOperands(&sourceRawOperand, 1);  ::llvm::SMLoc sourceOperandsLoc;
  (void)sourceOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> padding_valueOperands;
  ::llvm::SMLoc padding_valueOperandsLoc;
  (void)padding_valueOperandsLoc;
  ::llvm::SmallVector<::mlir::Type, 1> padding_valueTypes;
  ::mlir::DenseI64ArrayAttr outer_dims_permAttr;
  ::mlir::DenseI64ArrayAttr inner_dims_posAttr;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> inner_tilesOperands;
  ::llvm::SMLoc inner_tilesOperandsLoc;
  (void)inner_tilesOperandsLoc;
  ::mlir::DenseI64ArrayAttr static_inner_tilesAttr;
  ::mlir::OpAsmParser::UnresolvedOperand destRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> destOperands(&destRawOperand, 1);  ::llvm::SMLoc destOperandsLoc;
  (void)destOperandsLoc;
  ::mlir::Type sourceRawType{};
  ::llvm::ArrayRef<::mlir::Type> sourceTypes(&sourceRawType, 1);
  ::mlir::Type destRawType{};
  ::llvm::ArrayRef<::mlir::Type> destTypes(&destRawType, 1);

  sourceOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(sourceRawOperand))
    return ::mlir::failure();
  if (::mlir::succeeded(parser.parseOptionalKeyword("padding_value"))) {
  if (parser.parseLParen())
    return ::mlir::failure();

  {
    padding_valueOperandsLoc = parser.getCurrentLocation();
    ::mlir::OpAsmParser::UnresolvedOperand operand;
    ::mlir::OptionalParseResult parseResult =
                                    parser.parseOptionalOperand(operand);
    if (parseResult.has_value()) {
      if (failed(*parseResult))
        return ::mlir::failure();
      padding_valueOperands.push_back(operand);
    }
  }
  if (parser.parseColon())
    return ::mlir::failure();

  {
    ::mlir::Type optionalType;
    ::mlir::OptionalParseResult parseResult =
                                    parser.parseOptionalType(optionalType);
    if (parseResult.has_value()) {
      if (failed(*parseResult))
        return ::mlir::failure();
      padding_valueTypes.push_back(optionalType);
    }
  }
  if (parser.parseRParen())
    return ::mlir::failure();
  }
  if (::mlir::succeeded(parser.parseOptionalKeyword("outer_dims_perm"))) {
  if (parser.parseEqual())
    return ::mlir::failure();

  if (parser.parseCustomAttributeWithFallback(outer_dims_permAttr, ::mlir::Type{})) {
    return ::mlir::failure();
  }
  if (outer_dims_permAttr) result.getOrAddProperties<PackOp::Properties>().outer_dims_perm = outer_dims_permAttr;
  }
  if (parser.parseKeyword("inner_dims_pos"))
    return ::mlir::failure();
  if (parser.parseEqual())
    return ::mlir::failure();

  if (parser.parseCustomAttributeWithFallback(inner_dims_posAttr, ::mlir::Type{})) {
    return ::mlir::failure();
  }
  if (inner_dims_posAttr) result.getOrAddProperties<PackOp::Properties>().inner_dims_pos = inner_dims_posAttr;
  if (parser.parseKeyword("inner_tiles"))
    return ::mlir::failure();
  if (parser.parseEqual())
    return ::mlir::failure();
  {
    inner_tilesOperandsLoc = parser.getCurrentLocation();
    auto odsResult = parseDynamicIndexList(parser, inner_tilesOperands, static_inner_tilesAttr);
    if (odsResult) return ::mlir::failure();
    result.getOrAddProperties<PackOp::Properties>().static_inner_tiles = static_inner_tilesAttr;
  }
  if (parser.parseKeyword("into"))
    return ::mlir::failure();

  destOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(destRawOperand))
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
    ::mlir::RankedTensorType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    sourceRawType = type;
  }
  if (parser.parseArrow())
    return ::mlir::failure();

  {
    ::mlir::RankedTensorType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    destRawType = type;
  }
::llvm::copy(::llvm::ArrayRef<int32_t>({1, 1, static_cast<int32_t>(padding_valueOperands.size()), static_cast<int32_t>(inner_tilesOperands.size())}), result.getOrAddProperties<PackOp::Properties>().operandSegmentSizes.begin());
  for (::mlir::Type type : destTypes) {
    (void)type;
    if (!(((::llvm::isa<::mlir::RankedTensorType>(type))) && ([](::mlir::Type elementType) { return (true); }(::llvm::cast<::mlir::ShapedType>(type).getElementType())))) {
      return parser.emitError(parser.getNameLoc()) << "'dest' must be ranked tensor of any type values, but got " << type;
    }
  }
  ::mlir::Type odsBuildableType0 = parser.getBuilder().getIndexType();
  result.addTypes(destTypes[0]);
  if (parser.resolveOperands(sourceOperands, sourceTypes, sourceOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(destOperands, destTypes, destOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(padding_valueOperands, padding_valueTypes, padding_valueOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(inner_tilesOperands, odsBuildableType0, inner_tilesOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void PackOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  _odsPrinter << ' ';
  _odsPrinter << getSource();
  if (getPaddingValue()) {
    _odsPrinter << ' ' << "padding_value";
    _odsPrinter << "(";
    if (::mlir::Value value = getPaddingValue())
      _odsPrinter << value;
    _odsPrinter << ' ' << ":";
    _odsPrinter << ' ';
    _odsPrinter << (getPaddingValue() ? ::llvm::ArrayRef<::mlir::Type>(getPaddingValue().getType()) : ::llvm::ArrayRef<::mlir::Type>());
    _odsPrinter << ")";
  }
  if ((getOuterDimsPermAttr() && getOuterDimsPermAttr() != ::mlir::OpBuilder((*this)->getContext()).getDenseI64ArrayAttr({}))) {
    _odsPrinter << ' ' << "outer_dims_perm";
    _odsPrinter << ' ' << "=";
    _odsPrinter << ' ';
  _odsPrinter.printStrippedAttrOrType(getOuterDimsPermAttr());
  }
  _odsPrinter << ' ' << "inner_dims_pos";
  _odsPrinter << ' ' << "=";
  _odsPrinter << ' ';
_odsPrinter.printStrippedAttrOrType(getInnerDimsPosAttr());
  _odsPrinter << ' ' << "inner_tiles";
  _odsPrinter << ' ' << "=";
  _odsPrinter << ' ';
  printDynamicIndexList(_odsPrinter, *this, getInnerTiles(), getStaticInnerTilesAttr());
  _odsPrinter << ' ' << "into";
  _odsPrinter << ' ';
  _odsPrinter << getDest();
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("operandSegmentSizes");
  elidedAttrs.push_back("outer_dims_perm");
  elidedAttrs.push_back("inner_dims_pos");
  elidedAttrs.push_back("static_inner_tiles");
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getOuterDimsPermAttr();
     if(attr && (attr == odsBuilder.getDenseI64ArrayAttr({})))
       elidedAttrs.push_back("outer_dims_perm");
  }
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getSource().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::RankedTensorType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ' ' << "->";
  _odsPrinter << ' ';
  {
    auto type = getDest().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::RankedTensorType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
}

void PackOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
}

} // namespace linalg
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::linalg::PackOp)

namespace mlir {
namespace linalg {

//===----------------------------------------------------------------------===//
// ::mlir::linalg::UnPackOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
UnPackOpGenericAdaptorBase::UnPackOpGenericAdaptorBase(UnPackOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

std::pair<unsigned, unsigned> UnPackOpGenericAdaptorBase::getODSOperandIndexAndLength(unsigned index, unsigned odsOperandsSize) {
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

::mlir::DenseI64ArrayAttr UnPackOpGenericAdaptorBase::getOuterDimsPermAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::DenseI64ArrayAttr>(getProperties().outer_dims_perm);
  if (!attr)
    attr = ::mlir::Builder(odsAttrs.getContext()).getDenseI64ArrayAttr({});
  return attr;
}

::llvm::ArrayRef<int64_t> UnPackOpGenericAdaptorBase::getOuterDimsPerm() {
  auto attr = getOuterDimsPermAttr();
    if (!attr)
      return ::mlir::Builder(odsAttrs.getContext()).getDenseI64ArrayAttr({});
  return attr;
}

::llvm::ArrayRef<int64_t> UnPackOpGenericAdaptorBase::getInnerDimsPos() {
  auto attr = getInnerDimsPosAttr();
  return attr;
}

::llvm::ArrayRef<int64_t> UnPackOpGenericAdaptorBase::getStaticInnerTiles() {
  auto attr = getStaticInnerTilesAttr();
  return attr;
}

} // namespace detail
UnPackOpAdaptor::UnPackOpAdaptor(UnPackOp op) : UnPackOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult UnPackOpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_inner_dims_pos = getProperties().inner_dims_pos; (void)tblgen_inner_dims_pos;
  if (!tblgen_inner_dims_pos) return emitError(loc, "'linalg.unpack' op ""requires attribute 'inner_dims_pos'");
  auto tblgen_outer_dims_perm = getProperties().outer_dims_perm; (void)tblgen_outer_dims_perm;
  auto tblgen_static_inner_tiles = getProperties().static_inner_tiles; (void)tblgen_static_inner_tiles;
  if (!tblgen_static_inner_tiles) return emitError(loc, "'linalg.unpack' op ""requires attribute 'static_inner_tiles'");

  if (tblgen_outer_dims_perm && !((::llvm::isa<::mlir::DenseI64ArrayAttr>(tblgen_outer_dims_perm))))
    return emitError(loc, "'linalg.unpack' op ""attribute 'outer_dims_perm' failed to satisfy constraint: i64 dense array attribute");

  if (tblgen_inner_dims_pos && !((::llvm::isa<::mlir::DenseI64ArrayAttr>(tblgen_inner_dims_pos))))
    return emitError(loc, "'linalg.unpack' op ""attribute 'inner_dims_pos' failed to satisfy constraint: i64 dense array attribute");

  if (tblgen_static_inner_tiles && !((::llvm::isa<::mlir::DenseI64ArrayAttr>(tblgen_static_inner_tiles))))
    return emitError(loc, "'linalg.unpack' op ""attribute 'static_inner_tiles' failed to satisfy constraint: i64 dense array attribute");
  return ::mlir::success();
}

std::pair<unsigned, unsigned> UnPackOp::getODSOperandIndexAndLength(unsigned index) {
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

::mlir::MutableOperandRange UnPackOp::getInnerTilesMutable() {
  auto range = getODSOperandIndexAndLength(2);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second);
  return mutableRange;
}

::llvm::LogicalResult UnPackOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.inner_dims_pos;
       auto attr = dict.get("inner_dims_pos");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `inner_dims_pos` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.outer_dims_perm;
       auto attr = dict.get("outer_dims_perm");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `outer_dims_perm` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.static_inner_tiles;
       auto attr = dict.get("static_inner_tiles");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `static_inner_tiles` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
  return ::mlir::success();
}

::mlir::Attribute UnPackOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.inner_dims_pos;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("inner_dims_pos",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.outer_dims_perm;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("outer_dims_perm",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.static_inner_tiles;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("static_inner_tiles",
                                       propStorage));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code UnPackOp::computePropertiesHash(const Properties &prop) {
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.inner_dims_pos.getAsOpaquePointer()), 
    llvm::hash_value(prop.outer_dims_perm.getAsOpaquePointer()), 
    llvm::hash_value(prop.static_inner_tiles.getAsOpaquePointer()));
}

std::optional<mlir::Attribute> UnPackOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "inner_dims_pos")
      return prop.inner_dims_pos;

    if (name == "outer_dims_perm")
      return prop.outer_dims_perm;

    if (name == "static_inner_tiles")
      return prop.static_inner_tiles;
  return std::nullopt;
}

void UnPackOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "inner_dims_pos") {
       prop.inner_dims_pos = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.inner_dims_pos)>>(value);
       return;
    }

    if (name == "outer_dims_perm") {
       prop.outer_dims_perm = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.outer_dims_perm)>>(value);
       return;
    }

    if (name == "static_inner_tiles") {
       prop.static_inner_tiles = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.static_inner_tiles)>>(value);
       return;
    }
}

void UnPackOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.inner_dims_pos) attrs.append("inner_dims_pos", prop.inner_dims_pos);

    if (prop.outer_dims_perm) attrs.append("outer_dims_perm", prop.outer_dims_perm);

    if (prop.static_inner_tiles) attrs.append("static_inner_tiles", prop.static_inner_tiles);
}

::llvm::LogicalResult UnPackOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getInnerDimsPosAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_LinalgRelayoutOps1(attr, "inner_dims_pos", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getOuterDimsPermAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_LinalgRelayoutOps1(attr, "outer_dims_perm", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getStaticInnerTilesAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_LinalgRelayoutOps1(attr, "static_inner_tiles", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult UnPackOp::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readAttribute(prop.inner_dims_pos)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.outer_dims_perm)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readAttribute(prop.static_inner_tiles)))
    return ::mlir::failure();
  return ::mlir::success();
}

void UnPackOp::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;
  writer.writeAttribute(prop.inner_dims_pos);

  writer.writeOptionalAttribute(prop.outer_dims_perm);
  writer.writeAttribute(prop.static_inner_tiles);
}

::llvm::ArrayRef<int64_t> UnPackOp::getOuterDimsPerm() {
  auto attr = getOuterDimsPermAttr();
    if (!attr)
      return ::mlir::Builder((*this)->getContext()).getDenseI64ArrayAttr({});
  return attr;
}

::llvm::ArrayRef<int64_t> UnPackOp::getInnerDimsPos() {
  auto attr = getInnerDimsPosAttr();
  return attr;
}

::llvm::ArrayRef<int64_t> UnPackOp::getStaticInnerTiles() {
  auto attr = getStaticInnerTilesAttr();
  return attr;
}

void UnPackOp::setOuterDimsPerm(::std::optional<::llvm::ArrayRef<int64_t>> attrValue) {
    auto &odsProp = getProperties().outer_dims_perm;
    if (attrValue)
      odsProp = ::mlir::Builder((*this)->getContext()).getDenseI64ArrayAttr(*attrValue);
    else
      odsProp = nullptr;
}

void UnPackOp::setInnerDimsPos(::llvm::ArrayRef<int64_t> attrValue) {
  getProperties().inner_dims_pos = ::mlir::Builder((*this)->getContext()).getDenseI64ArrayAttr(attrValue);
}

void UnPackOp::setStaticInnerTiles(::llvm::ArrayRef<int64_t> attrValue) {
  getProperties().static_inner_tiles = ::mlir::Builder((*this)->getContext()).getDenseI64ArrayAttr(attrValue);
}

void UnPackOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type result, ::mlir::Value source, ::mlir::Value dest, /*optional*/::mlir::DenseI64ArrayAttr outer_dims_perm, ::mlir::DenseI64ArrayAttr inner_dims_pos, ::mlir::ValueRange inner_tiles, ::mlir::DenseI64ArrayAttr static_inner_tiles) {
  odsState.addOperands(source);
  odsState.addOperands(dest);
  odsState.addOperands(inner_tiles);
  if (outer_dims_perm) {
    odsState.getOrAddProperties<Properties>().outer_dims_perm = outer_dims_perm;
  }
  odsState.getOrAddProperties<Properties>().inner_dims_pos = inner_dims_pos;
  odsState.getOrAddProperties<Properties>().static_inner_tiles = static_inner_tiles;
  odsState.addTypes(result);
}

void UnPackOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value source, ::mlir::Value dest, /*optional*/::mlir::DenseI64ArrayAttr outer_dims_perm, ::mlir::DenseI64ArrayAttr inner_dims_pos, ::mlir::ValueRange inner_tiles, ::mlir::DenseI64ArrayAttr static_inner_tiles) {
  odsState.addOperands(source);
  odsState.addOperands(dest);
  odsState.addOperands(inner_tiles);
  if (outer_dims_perm) {
    odsState.getOrAddProperties<Properties>().outer_dims_perm = outer_dims_perm;
  }
  odsState.getOrAddProperties<Properties>().inner_dims_pos = inner_dims_pos;
  odsState.getOrAddProperties<Properties>().static_inner_tiles = static_inner_tiles;

        ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
        if (::mlir::succeeded(UnPackOp::inferReturnTypes(odsBuilder.getContext(),
                      odsState.location, odsState.operands,
                      odsState.attributes.getDictionary(odsState.getContext()),
                      odsState.getRawProperties(),
                      odsState.regions, inferredReturnTypes)))
          odsState.addTypes(inferredReturnTypes);
        else
          ::mlir::detail::reportFatalInferReturnTypesError(odsState);
        
}

void UnPackOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value source, ::mlir::Value dest, /*optional*/::mlir::DenseI64ArrayAttr outer_dims_perm, ::mlir::DenseI64ArrayAttr inner_dims_pos, ::mlir::ValueRange inner_tiles, ::mlir::DenseI64ArrayAttr static_inner_tiles) {
  odsState.addOperands(source);
  odsState.addOperands(dest);
  odsState.addOperands(inner_tiles);
  if (outer_dims_perm) {
    odsState.getOrAddProperties<Properties>().outer_dims_perm = outer_dims_perm;
  }
  odsState.getOrAddProperties<Properties>().inner_dims_pos = inner_dims_pos;
  odsState.getOrAddProperties<Properties>().static_inner_tiles = static_inner_tiles;
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void UnPackOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type result, ::mlir::Value source, ::mlir::Value dest, /*optional*/::llvm::ArrayRef<int64_t> outer_dims_perm, ::llvm::ArrayRef<int64_t> inner_dims_pos, ::mlir::ValueRange inner_tiles, ::llvm::ArrayRef<int64_t> static_inner_tiles) {
  odsState.addOperands(source);
  odsState.addOperands(dest);
  odsState.addOperands(inner_tiles);
  odsState.getOrAddProperties<Properties>().outer_dims_perm = odsBuilder.getDenseI64ArrayAttr(outer_dims_perm);
  odsState.getOrAddProperties<Properties>().inner_dims_pos = odsBuilder.getDenseI64ArrayAttr(inner_dims_pos);
  odsState.getOrAddProperties<Properties>().static_inner_tiles = odsBuilder.getDenseI64ArrayAttr(static_inner_tiles);
  odsState.addTypes(result);
}

void UnPackOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value source, ::mlir::Value dest, /*optional*/::llvm::ArrayRef<int64_t> outer_dims_perm, ::llvm::ArrayRef<int64_t> inner_dims_pos, ::mlir::ValueRange inner_tiles, ::llvm::ArrayRef<int64_t> static_inner_tiles) {
  odsState.addOperands(source);
  odsState.addOperands(dest);
  odsState.addOperands(inner_tiles);
  odsState.getOrAddProperties<Properties>().outer_dims_perm = odsBuilder.getDenseI64ArrayAttr(outer_dims_perm);
  odsState.getOrAddProperties<Properties>().inner_dims_pos = odsBuilder.getDenseI64ArrayAttr(inner_dims_pos);
  odsState.getOrAddProperties<Properties>().static_inner_tiles = odsBuilder.getDenseI64ArrayAttr(static_inner_tiles);

        ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
        if (::mlir::succeeded(UnPackOp::inferReturnTypes(odsBuilder.getContext(),
                      odsState.location, odsState.operands,
                      odsState.attributes.getDictionary(odsState.getContext()),
                      odsState.getRawProperties(),
                      odsState.regions, inferredReturnTypes)))
          odsState.addTypes(inferredReturnTypes);
        else
          ::mlir::detail::reportFatalInferReturnTypesError(odsState);
        
}

void UnPackOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value source, ::mlir::Value dest, /*optional*/::llvm::ArrayRef<int64_t> outer_dims_perm, ::llvm::ArrayRef<int64_t> inner_dims_pos, ::mlir::ValueRange inner_tiles, ::llvm::ArrayRef<int64_t> static_inner_tiles) {
  odsState.addOperands(source);
  odsState.addOperands(dest);
  odsState.addOperands(inner_tiles);
  odsState.getOrAddProperties<Properties>().outer_dims_perm = odsBuilder.getDenseI64ArrayAttr(outer_dims_perm);
  odsState.getOrAddProperties<Properties>().inner_dims_pos = odsBuilder.getDenseI64ArrayAttr(inner_dims_pos);
  odsState.getOrAddProperties<Properties>().static_inner_tiles = odsBuilder.getDenseI64ArrayAttr(static_inner_tiles);
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void UnPackOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<UnPackOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void UnPackOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<UnPackOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
  ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
  if (::mlir::succeeded(UnPackOp::inferReturnTypes(odsBuilder.getContext(),
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

void UnPackOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void UnPackOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties &>(properties));
  odsState.addAttributes(discardableAttributes);

  ::llvm::SmallVector<::mlir::Type, 2> inferredReturnTypes;
  if (::mlir::succeeded(UnPackOp::inferReturnTypes(odsBuilder.getContext(),
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

::llvm::LogicalResult UnPackOp::verifyInvariantsImpl() {
  auto tblgen_inner_dims_pos = getProperties().inner_dims_pos; (void)tblgen_inner_dims_pos;
  if (!tblgen_inner_dims_pos) return emitOpError("requires attribute 'inner_dims_pos'");
  auto tblgen_outer_dims_perm = getProperties().outer_dims_perm; (void)tblgen_outer_dims_perm;
  auto tblgen_static_inner_tiles = getProperties().static_inner_tiles; (void)tblgen_static_inner_tiles;
  if (!tblgen_static_inner_tiles) return emitOpError("requires attribute 'static_inner_tiles'");

  if (::mlir::failed(__mlir_ods_local_attr_constraint_LinalgRelayoutOps1(*this, tblgen_outer_dims_perm, "outer_dims_perm")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_LinalgRelayoutOps1(*this, tblgen_inner_dims_pos, "inner_dims_pos")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_LinalgRelayoutOps1(*this, tblgen_static_inner_tiles, "static_inner_tiles")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_LinalgRelayoutOps1(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_LinalgRelayoutOps1(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup2 = getODSOperands(2);

    for (auto v : valueGroup2) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_LinalgRelayoutOps3(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSResults(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_LinalgRelayoutOps1(*this, v.getType(), "result", index++)))
        return ::mlir::failure();
    }
  }
  if (!((std::equal_to<>()((*this->getODSOperands(1).begin()).getType(), (*this->getODSResults(0).begin()).getType()))))
    return emitOpError("failed to verify that result type matches type of dest");
  return ::mlir::success();
}

::llvm::LogicalResult UnPackOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

void UnPackOp::getCanonicalizationPatterns(::mlir::RewritePatternSet &results, ::mlir::MLIRContext *context) {
  results.add(canonicalize);
}

::llvm::LogicalResult UnPackOp::inferReturnTypes(::mlir::MLIRContext *context, ::std::optional<::mlir::Location> location, ::mlir::ValueRange operands, ::mlir::DictionaryAttr attributes, ::mlir::OpaqueProperties properties, ::mlir::RegionRange regions, ::llvm::SmallVectorImpl<::mlir::Type>&inferredReturnTypes) {
  inferredReturnTypes.resize(1);
  ::mlir::Builder odsBuilder(context);
  if (operands.size() <= 1)
    return ::mlir::failure();
  ::mlir::Type odsInferredType0 = operands[1].getType();
  inferredReturnTypes[0] = odsInferredType0;
  return ::mlir::success();
}

::mlir::ParseResult UnPackOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand sourceRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> sourceOperands(&sourceRawOperand, 1);  ::llvm::SMLoc sourceOperandsLoc;
  (void)sourceOperandsLoc;
  ::mlir::DenseI64ArrayAttr outer_dims_permAttr;
  ::mlir::DenseI64ArrayAttr inner_dims_posAttr;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> inner_tilesOperands;
  ::llvm::SMLoc inner_tilesOperandsLoc;
  (void)inner_tilesOperandsLoc;
  ::mlir::DenseI64ArrayAttr static_inner_tilesAttr;
  ::mlir::OpAsmParser::UnresolvedOperand destRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> destOperands(&destRawOperand, 1);  ::llvm::SMLoc destOperandsLoc;
  (void)destOperandsLoc;
  ::mlir::Type sourceRawType{};
  ::llvm::ArrayRef<::mlir::Type> sourceTypes(&sourceRawType, 1);
  ::mlir::Type destRawType{};
  ::llvm::ArrayRef<::mlir::Type> destTypes(&destRawType, 1);

  sourceOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(sourceRawOperand))
    return ::mlir::failure();
  if (::mlir::succeeded(parser.parseOptionalKeyword("outer_dims_perm"))) {
  if (parser.parseEqual())
    return ::mlir::failure();

  if (parser.parseCustomAttributeWithFallback(outer_dims_permAttr, ::mlir::Type{})) {
    return ::mlir::failure();
  }
  if (outer_dims_permAttr) result.getOrAddProperties<UnPackOp::Properties>().outer_dims_perm = outer_dims_permAttr;
  }
  if (parser.parseKeyword("inner_dims_pos"))
    return ::mlir::failure();
  if (parser.parseEqual())
    return ::mlir::failure();

  if (parser.parseCustomAttributeWithFallback(inner_dims_posAttr, ::mlir::Type{})) {
    return ::mlir::failure();
  }
  if (inner_dims_posAttr) result.getOrAddProperties<UnPackOp::Properties>().inner_dims_pos = inner_dims_posAttr;
  if (parser.parseKeyword("inner_tiles"))
    return ::mlir::failure();
  if (parser.parseEqual())
    return ::mlir::failure();
  {
    inner_tilesOperandsLoc = parser.getCurrentLocation();
    auto odsResult = parseDynamicIndexList(parser, inner_tilesOperands, static_inner_tilesAttr);
    if (odsResult) return ::mlir::failure();
    result.getOrAddProperties<UnPackOp::Properties>().static_inner_tiles = static_inner_tilesAttr;
  }
  if (parser.parseKeyword("into"))
    return ::mlir::failure();

  destOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(destRawOperand))
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
    ::mlir::RankedTensorType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    sourceRawType = type;
  }
  if (parser.parseArrow())
    return ::mlir::failure();

  {
    ::mlir::RankedTensorType type;
    if (parser.parseCustomTypeWithFallback(type))
      return ::mlir::failure();
    destRawType = type;
  }
  for (::mlir::Type type : destTypes) {
    (void)type;
    if (!(((::llvm::isa<::mlir::RankedTensorType>(type))) && ([](::mlir::Type elementType) { return (true); }(::llvm::cast<::mlir::ShapedType>(type).getElementType())))) {
      return parser.emitError(parser.getNameLoc()) << "'dest' must be ranked tensor of any type values, but got " << type;
    }
  }
  ::mlir::Type odsBuildableType0 = parser.getBuilder().getIndexType();
  result.addTypes(destTypes[0]);
  if (parser.resolveOperands(sourceOperands, sourceTypes, sourceOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(destOperands, destTypes, destOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(inner_tilesOperands, odsBuildableType0, inner_tilesOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void UnPackOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  _odsPrinter << ' ';
  _odsPrinter << getSource();
  if ((getOuterDimsPermAttr() && getOuterDimsPermAttr() != ::mlir::OpBuilder((*this)->getContext()).getDenseI64ArrayAttr({}))) {
    _odsPrinter << ' ' << "outer_dims_perm";
    _odsPrinter << ' ' << "=";
    _odsPrinter << ' ';
  _odsPrinter.printStrippedAttrOrType(getOuterDimsPermAttr());
  }
  _odsPrinter << ' ' << "inner_dims_pos";
  _odsPrinter << ' ' << "=";
  _odsPrinter << ' ';
_odsPrinter.printStrippedAttrOrType(getInnerDimsPosAttr());
  _odsPrinter << ' ' << "inner_tiles";
  _odsPrinter << ' ' << "=";
  _odsPrinter << ' ';
  printDynamicIndexList(_odsPrinter, *this, getInnerTiles(), getStaticInnerTilesAttr());
  _odsPrinter << ' ' << "into";
  _odsPrinter << ' ';
  _odsPrinter << getDest();
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("outer_dims_perm");
  elidedAttrs.push_back("inner_dims_pos");
  elidedAttrs.push_back("static_inner_tiles");
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getOuterDimsPermAttr();
     if(attr && (attr == odsBuilder.getDenseI64ArrayAttr({})))
       elidedAttrs.push_back("outer_dims_perm");
  }
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getSource().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::RankedTensorType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ' ' << "->";
  _odsPrinter << ' ';
  {
    auto type = getDest().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::RankedTensorType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
}

void UnPackOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
}

} // namespace linalg
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::linalg::UnPackOp)


#endif  // GET_OP_CLASSES

