/*===- TableGen'erated file -------------------------------------*- C++ -*-===*\
|*                                                                            *|
|* Op Definitions                                                             *|
|*                                                                            *|
|* Automatically generated file, do not edit!                                 *|
|* From: AMX.td                                                               *|
|*                                                                            *|
\*===----------------------------------------------------------------------===*/

#ifdef GET_OP_LIST
#undef GET_OP_LIST

::mlir::amx::TileLoadOp,
::mlir::amx::TileMulFOp,
::mlir::amx::TileMulIOp,
::mlir::amx::TileStoreOp,
::mlir::amx::TileZeroOp
#endif  // GET_OP_LIST

#ifdef GET_OP_CLASSES
#undef GET_OP_CLASSES


//===----------------------------------------------------------------------===//
// Local Utility Method Definitions
//===----------------------------------------------------------------------===//

namespace mlir {
namespace amx {

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMX1(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!(((::llvm::isa<::mlir::MemRefType>(type))) && ([](::mlir::Type elementType) { return (true); }(::llvm::cast<::mlir::ShapedType>(type).getElementType())))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be memref of any type values, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMX2(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!((::llvm::isa<::mlir::IndexType>(type)))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be variadic of index, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMX3(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!((((::llvm::isa<::mlir::amx::TileType>(type))) && ((::llvm::cast<::mlir::amx::TileType>(type).getRank() == 2))) && ([](::mlir::Type elementType) { return ((elementType.isF32())) || ((elementType.isF16())) || ((::llvm::isa<::mlir::BFloat16Type>(elementType))) || ((elementType.isSignlessInteger(32))) || ((elementType.isSignlessInteger(8))); }(::llvm::cast<::mlir::ShapedType>(type).getElementType())))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be tile of 32-bit float or 16-bit float or bfloat16 type or 32-bit signless integer or 8-bit signless integer values, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMX4(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!((((::llvm::isa<::mlir::amx::TileType>(type))) && ((::llvm::cast<::mlir::amx::TileType>(type).getRank() == 2))) && ([](::mlir::Type elementType) { return ((elementType.isF16())) || ((::llvm::isa<::mlir::BFloat16Type>(elementType))); }(::llvm::cast<::mlir::ShapedType>(type).getElementType())))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be tile of 16-bit float or bfloat16 type values, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMX5(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!((((::llvm::isa<::mlir::amx::TileType>(type))) && ((::llvm::cast<::mlir::amx::TileType>(type).getRank() == 2))) && ([](::mlir::Type elementType) { return (elementType.isF32()); }(::llvm::cast<::mlir::ShapedType>(type).getElementType())))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be tile of 32-bit float values, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMX6(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!((((::llvm::isa<::mlir::amx::TileType>(type))) && ((::llvm::cast<::mlir::amx::TileType>(type).getRank() == 2))) && ([](::mlir::Type elementType) { return (elementType.isSignlessInteger(8)); }(::llvm::cast<::mlir::ShapedType>(type).getElementType())))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be tile of 8-bit signless integer values, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_type_constraint_AMX7(
    ::mlir::Operation *op, ::mlir::Type type, ::llvm::StringRef valueKind,
    unsigned valueIndex) {
  if (!((((::llvm::isa<::mlir::amx::TileType>(type))) && ((::llvm::cast<::mlir::amx::TileType>(type).getRank() == 2))) && ([](::mlir::Type elementType) { return (elementType.isSignlessInteger(32)); }(::llvm::cast<::mlir::ShapedType>(type).getElementType())))) {
    return op->emitOpError(valueKind) << " #" << valueIndex
        << " must be tile of 32-bit signless integer values, but got " << type;
  }
  return ::mlir::success();
}

static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMX1(
    ::mlir::Attribute attr, ::llvm::StringRef attrName, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  if (attr && !((::llvm::isa<::mlir::UnitAttr>(attr))))
    return emitError() << "attribute '" << attrName
        << "' failed to satisfy constraint: unit attribute";
  return ::mlir::success();
}
static ::llvm::LogicalResult __mlir_ods_local_attr_constraint_AMX1(
    ::mlir::Operation *op, ::mlir::Attribute attr, ::llvm::StringRef attrName) {
  return __mlir_ods_local_attr_constraint_AMX1(attr, attrName, [op]() {
    return op->emitOpError();
  });
}
} // namespace amx
} // namespace mlir
namespace mlir {
namespace amx {

//===----------------------------------------------------------------------===//
// ::mlir::amx::TileLoadOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
TileLoadOpGenericAdaptorBase::TileLoadOpGenericAdaptorBase(TileLoadOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

std::pair<unsigned, unsigned> TileLoadOpGenericAdaptorBase::getODSOperandIndexAndLength(unsigned index, unsigned odsOperandsSize) {
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
TileLoadOpAdaptor::TileLoadOpAdaptor(TileLoadOp op) : TileLoadOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult TileLoadOpAdaptor::verify(::mlir::Location loc) {
  return ::mlir::success();
}

std::pair<unsigned, unsigned> TileLoadOp::getODSOperandIndexAndLength(unsigned index) {
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

::mlir::MutableOperandRange TileLoadOp::getIndicesMutable() {
  auto range = getODSOperandIndexAndLength(1);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second);
  return mutableRange;
}

::llvm::LogicalResult TileLoadOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }
      return ::mlir::success();
}

::mlir::Attribute TileLoadOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code TileLoadOp::computePropertiesHash(const Properties &prop) {
  using llvm::hash_value;
  return llvm::hash_combine();
}

std::optional<mlir::Attribute> TileLoadOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
  return std::nullopt;
}

void TileLoadOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
}

void TileLoadOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
}

::llvm::LogicalResult TileLoadOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    return ::mlir::success();
}

void TileLoadOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type res, ::mlir::Value base, ::mlir::ValueRange indices) {
  odsState.addOperands(base);
  odsState.addOperands(indices);
  odsState.addTypes(res);
}

void TileLoadOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value base, ::mlir::ValueRange indices) {
  odsState.addOperands(base);
  odsState.addOperands(indices);
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void TileLoadOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 1u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void TileLoadOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 1u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

::llvm::LogicalResult TileLoadOp::verifyInvariantsImpl() {
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMX1(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMX2(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSResults(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMX3(*this, v.getType(), "result", index++)))
        return ::mlir::failure();
    }
  }
  return ::mlir::success();
}

::llvm::LogicalResult TileLoadOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::mlir::ParseResult TileLoadOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand baseRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> baseOperands(&baseRawOperand, 1);  ::llvm::SMLoc baseOperandsLoc;
  (void)baseOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> indicesOperands;
  ::llvm::SMLoc indicesOperandsLoc;
  (void)indicesOperandsLoc;
  ::mlir::Type baseRawType{};
  ::llvm::ArrayRef<::mlir::Type> baseTypes(&baseRawType, 1);
  ::mlir::Type resRawType{};
  ::llvm::ArrayRef<::mlir::Type> resTypes(&resRawType, 1);

  baseOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(baseRawOperand))
    return ::mlir::failure();
  if (parser.parseLSquare())
    return ::mlir::failure();

  indicesOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperandList(indicesOperands))
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
    baseRawType = type;
  }
  if (parser.parseKeyword("into"))
    return ::mlir::failure();

  if (parser.parseType(resRawType))
    return ::mlir::failure();
  ::mlir::Type odsBuildableType0 = parser.getBuilder().getIndexType();
  result.addTypes(resTypes);
  if (parser.resolveOperands(baseOperands, baseTypes, baseOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(indicesOperands, odsBuildableType0, indicesOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void TileLoadOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  _odsPrinter << ' ';
  _odsPrinter << getBase();
  _odsPrinter << "[";
  _odsPrinter << getIndices();
  _odsPrinter << "]";
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getBase().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::MemRefType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ' ' << "into";
  _odsPrinter << ' ';
   _odsPrinter << getRes().getType();
}

void TileLoadOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
  {
    auto valueRange = getODSOperandIndexAndLength(0);
    for (unsigned idx = valueRange.first; idx < valueRange.first + valueRange.second; idx++) {
      effects.emplace_back(::mlir::MemoryEffects::Read::get(), &getOperation()->getOpOperand(idx), 0, false, ::mlir::SideEffects::DefaultResource::get());
    }
  }
}

} // namespace amx
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amx::TileLoadOp)

namespace mlir {
namespace amx {

//===----------------------------------------------------------------------===//
// ::mlir::amx::TileMulFOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
TileMulFOpGenericAdaptorBase::TileMulFOpGenericAdaptorBase(TileMulFOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

} // namespace detail
TileMulFOpAdaptor::TileMulFOpAdaptor(TileMulFOp op) : TileMulFOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult TileMulFOpAdaptor::verify(::mlir::Location loc) {
  return ::mlir::success();
}

::llvm::LogicalResult TileMulFOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }
      return ::mlir::success();
}

::mlir::Attribute TileMulFOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code TileMulFOp::computePropertiesHash(const Properties &prop) {
  using llvm::hash_value;
  return llvm::hash_combine();
}

std::optional<mlir::Attribute> TileMulFOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
  return std::nullopt;
}

void TileMulFOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
}

void TileMulFOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
}

::llvm::LogicalResult TileMulFOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    return ::mlir::success();
}

void TileMulFOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type res, ::mlir::Value lhs, ::mlir::Value rhs, ::mlir::Value acc) {
  odsState.addOperands(lhs);
  odsState.addOperands(rhs);
  odsState.addOperands(acc);
  odsState.addTypes(res);
}

void TileMulFOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value lhs, ::mlir::Value rhs, ::mlir::Value acc) {
  odsState.addOperands(lhs);
  odsState.addOperands(rhs);
  odsState.addOperands(acc);
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void TileMulFOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() == 3u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void TileMulFOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() == 3u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

::llvm::LogicalResult TileMulFOp::verifyInvariantsImpl() {
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMX4(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMX4(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup2 = getODSOperands(2);

    for (auto v : valueGroup2) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMX5(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSResults(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMX5(*this, v.getType(), "result", index++)))
        return ::mlir::failure();
    }
  }
  if (!((((*this->getODSOperands(2).begin()).getType()) == ((*this->getODSResults(0).begin()).getType()) && ((*this->getODSResults(0).begin()).getType()) == ((*this->getODSOperands(2).begin()).getType()))))
    return emitOpError("failed to verify that all of {acc, res} have same type");
  return ::mlir::success();
}

::llvm::LogicalResult TileMulFOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::mlir::ParseResult TileMulFOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand lhsRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> lhsOperands(&lhsRawOperand, 1);  ::llvm::SMLoc lhsOperandsLoc;
  (void)lhsOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand rhsRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> rhsOperands(&rhsRawOperand, 1);  ::llvm::SMLoc rhsOperandsLoc;
  (void)rhsOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand accRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> accOperands(&accRawOperand, 1);  ::llvm::SMLoc accOperandsLoc;
  (void)accOperandsLoc;
  ::mlir::Type lhsRawType{};
  ::llvm::ArrayRef<::mlir::Type> lhsTypes(&lhsRawType, 1);
  ::mlir::Type rhsRawType{};
  ::llvm::ArrayRef<::mlir::Type> rhsTypes(&rhsRawType, 1);
  ::mlir::Type accRawType{};
  ::llvm::ArrayRef<::mlir::Type> accTypes(&accRawType, 1);

  lhsOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(lhsRawOperand))
    return ::mlir::failure();
  if (parser.parseComma())
    return ::mlir::failure();

  rhsOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(rhsRawOperand))
    return ::mlir::failure();
  if (parser.parseComma())
    return ::mlir::failure();

  accOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(accRawOperand))
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

  if (parser.parseType(lhsRawType))
    return ::mlir::failure();
  if (parser.parseComma())
    return ::mlir::failure();

  if (parser.parseType(rhsRawType))
    return ::mlir::failure();
  if (parser.parseComma())
    return ::mlir::failure();

  if (parser.parseType(accRawType))
    return ::mlir::failure();
  result.addTypes(accTypes[0]);
  if (parser.resolveOperands(lhsOperands, lhsTypes, lhsOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(rhsOperands, rhsTypes, rhsOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(accOperands, accTypes, accOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void TileMulFOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  _odsPrinter << ' ';
  _odsPrinter << getLhs();
  _odsPrinter << ",";
  _odsPrinter << ' ';
  _odsPrinter << getRhs();
  _odsPrinter << ",";
  _odsPrinter << ' ';
  _odsPrinter << getAcc();
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
   _odsPrinter << getLhs().getType();
  _odsPrinter << ",";
  _odsPrinter << ' ';
   _odsPrinter << getRhs().getType();
  _odsPrinter << ",";
  _odsPrinter << ' ';
   _odsPrinter << getAcc().getType();
}

void TileMulFOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
}

} // namespace amx
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amx::TileMulFOp)

namespace mlir {
namespace amx {

//===----------------------------------------------------------------------===//
// ::mlir::amx::TileMulIOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
TileMulIOpGenericAdaptorBase::TileMulIOpGenericAdaptorBase(TileMulIOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

::mlir::UnitAttr TileMulIOpGenericAdaptorBase::getIsZextLhsAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::UnitAttr>(getProperties().isZextLhs);
  if (!attr)
    attr = ((false) ? ::mlir::Builder(odsAttrs.getContext()).getUnitAttr() : nullptr);
  return attr;
}

bool TileMulIOpGenericAdaptorBase::getIsZextLhs() {
  auto attr = getIsZextLhsAttr();
    if (!attr)
      return ((false) ? ::mlir::Builder(odsAttrs.getContext()).getUnitAttr() : nullptr) != nullptr;
  return attr != nullptr;
}

::mlir::UnitAttr TileMulIOpGenericAdaptorBase::getIsZextRhsAttr() {
  auto attr = ::llvm::dyn_cast_or_null<::mlir::UnitAttr>(getProperties().isZextRhs);
  if (!attr)
    attr = ((false) ? ::mlir::Builder(odsAttrs.getContext()).getUnitAttr() : nullptr);
  return attr;
}

bool TileMulIOpGenericAdaptorBase::getIsZextRhs() {
  auto attr = getIsZextRhsAttr();
    if (!attr)
      return ((false) ? ::mlir::Builder(odsAttrs.getContext()).getUnitAttr() : nullptr) != nullptr;
  return attr != nullptr;
}

} // namespace detail
TileMulIOpAdaptor::TileMulIOpAdaptor(TileMulIOp op) : TileMulIOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult TileMulIOpAdaptor::verify(::mlir::Location loc) {
  auto tblgen_isZextLhs = getProperties().isZextLhs; (void)tblgen_isZextLhs;
  auto tblgen_isZextRhs = getProperties().isZextRhs; (void)tblgen_isZextRhs;

  if (tblgen_isZextLhs && !((::llvm::isa<::mlir::UnitAttr>(tblgen_isZextLhs))))
    return emitError(loc, "'amx.tile_muli' op ""attribute 'isZextLhs' failed to satisfy constraint: unit attribute");

  if (tblgen_isZextRhs && !((::llvm::isa<::mlir::UnitAttr>(tblgen_isZextRhs))))
    return emitError(loc, "'amx.tile_muli' op ""attribute 'isZextRhs' failed to satisfy constraint: unit attribute");
  return ::mlir::success();
}

::llvm::LogicalResult TileMulIOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }

  {
    auto &propStorage = prop.isZextLhs;
       auto attr = dict.get("isZextLhs");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `isZextLhs` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }

  {
    auto &propStorage = prop.isZextRhs;
       auto attr = dict.get("isZextRhs");
    if (attr) {
      auto convertedAttr = ::llvm::dyn_cast<std::remove_reference_t<decltype(propStorage)>>(attr);
      if (convertedAttr) {
        propStorage = convertedAttr;
      } else {
        emitError() << "Invalid attribute `isZextRhs` in property conversion: " << attr;
        return ::mlir::failure();
      }
    }
  }
  return ::mlir::success();
}

::mlir::Attribute TileMulIOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

    {
      const auto &propStorage = prop.isZextLhs;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("isZextLhs",
                                       propStorage));
    }

    {
      const auto &propStorage = prop.isZextRhs;
      if (propStorage)
        attrs.push_back(odsBuilder.getNamedAttr("isZextRhs",
                                       propStorage));
    }

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code TileMulIOp::computePropertiesHash(const Properties &prop) {
  using llvm::hash_value;
  return llvm::hash_combine(
    llvm::hash_value(prop.isZextLhs.getAsOpaquePointer()), 
    llvm::hash_value(prop.isZextRhs.getAsOpaquePointer()));
}

std::optional<mlir::Attribute> TileMulIOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
    if (name == "isZextLhs")
      return prop.isZextLhs;

    if (name == "isZextRhs")
      return prop.isZextRhs;
  return std::nullopt;
}

void TileMulIOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
    if (name == "isZextLhs") {
       prop.isZextLhs = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.isZextLhs)>>(value);
       return;
    }

    if (name == "isZextRhs") {
       prop.isZextRhs = ::llvm::dyn_cast_or_null<std::remove_reference_t<decltype(prop.isZextRhs)>>(value);
       return;
    }
}

void TileMulIOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
    if (prop.isZextLhs) attrs.append("isZextLhs", prop.isZextLhs);

    if (prop.isZextRhs) attrs.append("isZextRhs", prop.isZextRhs);
}

::llvm::LogicalResult TileMulIOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    {
      ::mlir::Attribute attr = attrs.get(getIsZextLhsAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMX1(attr, "isZextLhs", emitError)))
        return ::mlir::failure();
    }

    {
      ::mlir::Attribute attr = attrs.get(getIsZextRhsAttrName(opName));
      if (attr && ::mlir::failed(__mlir_ods_local_attr_constraint_AMX1(attr, "isZextRhs", emitError)))
        return ::mlir::failure();
    }
    return ::mlir::success();
}

::llvm::LogicalResult TileMulIOp::readProperties(::mlir::DialectBytecodeReader &reader, ::mlir::OperationState &state) {
  auto &prop = state.getOrAddProperties<Properties>(); (void)prop;
  if (::mlir::failed(reader.readOptionalAttribute(prop.isZextLhs)))
    return ::mlir::failure();

  if (::mlir::failed(reader.readOptionalAttribute(prop.isZextRhs)))
    return ::mlir::failure();
  return ::mlir::success();
}

void TileMulIOp::writeProperties(::mlir::DialectBytecodeWriter &writer) {
  auto &prop = getProperties(); (void)prop;

  writer.writeOptionalAttribute(prop.isZextLhs);

  writer.writeOptionalAttribute(prop.isZextRhs);
}

bool TileMulIOp::getIsZextLhs() {
  auto attr = getIsZextLhsAttr();
    if (!attr)
      return ((false) ? ::mlir::Builder((*this)->getContext()).getUnitAttr() : nullptr) != nullptr;
  return attr != nullptr;
}

bool TileMulIOp::getIsZextRhs() {
  auto attr = getIsZextRhsAttr();
    if (!attr)
      return ((false) ? ::mlir::Builder((*this)->getContext()).getUnitAttr() : nullptr) != nullptr;
  return attr != nullptr;
}

void TileMulIOp::setIsZextLhs(bool attrValue) {
    auto &odsProp = getProperties().isZextLhs;
    if (attrValue)
      odsProp = ((attrValue) ? ::mlir::Builder((*this)->getContext()).getUnitAttr() : nullptr);
    else
      odsProp = nullptr;
}

void TileMulIOp::setIsZextRhs(bool attrValue) {
    auto &odsProp = getProperties().isZextRhs;
    if (attrValue)
      odsProp = ((attrValue) ? ::mlir::Builder((*this)->getContext()).getUnitAttr() : nullptr);
    else
      odsProp = nullptr;
}

void TileMulIOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type res, ::mlir::Value lhs, ::mlir::Value rhs, ::mlir::Value acc, /*optional*/::mlir::UnitAttr isZextLhs, /*optional*/::mlir::UnitAttr isZextRhs) {
  odsState.addOperands(lhs);
  odsState.addOperands(rhs);
  odsState.addOperands(acc);
  if (isZextLhs) {
    odsState.getOrAddProperties<Properties>().isZextLhs = isZextLhs;
  }
  if (isZextRhs) {
    odsState.getOrAddProperties<Properties>().isZextRhs = isZextRhs;
  }
  odsState.addTypes(res);
}

void TileMulIOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value lhs, ::mlir::Value rhs, ::mlir::Value acc, /*optional*/::mlir::UnitAttr isZextLhs, /*optional*/::mlir::UnitAttr isZextRhs) {
  odsState.addOperands(lhs);
  odsState.addOperands(rhs);
  odsState.addOperands(acc);
  if (isZextLhs) {
    odsState.getOrAddProperties<Properties>().isZextLhs = isZextLhs;
  }
  if (isZextRhs) {
    odsState.getOrAddProperties<Properties>().isZextRhs = isZextRhs;
  }
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void TileMulIOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type res, ::mlir::Value lhs, ::mlir::Value rhs, ::mlir::Value acc, /*optional*/bool isZextLhs, /*optional*/bool isZextRhs) {
  odsState.addOperands(lhs);
  odsState.addOperands(rhs);
  odsState.addOperands(acc);
  if (isZextLhs) {
    odsState.getOrAddProperties<Properties>().isZextLhs = ((isZextLhs) ? odsBuilder.getUnitAttr() : nullptr);
  }
  if (isZextRhs) {
    odsState.getOrAddProperties<Properties>().isZextRhs = ((isZextRhs) ? odsBuilder.getUnitAttr() : nullptr);
  }
  odsState.addTypes(res);
}

void TileMulIOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value lhs, ::mlir::Value rhs, ::mlir::Value acc, /*optional*/bool isZextLhs, /*optional*/bool isZextRhs) {
  odsState.addOperands(lhs);
  odsState.addOperands(rhs);
  odsState.addOperands(acc);
  if (isZextLhs) {
    odsState.getOrAddProperties<Properties>().isZextLhs = ((isZextLhs) ? odsBuilder.getUnitAttr() : nullptr);
  }
  if (isZextRhs) {
    odsState.getOrAddProperties<Properties>().isZextRhs = ((isZextRhs) ? odsBuilder.getUnitAttr() : nullptr);
  }
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void TileMulIOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() == 3u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);

  if (!attributes.empty()) {
    ::mlir::OpaqueProperties properties =
      &odsState.getOrAddProperties<TileMulIOp::Properties>();
    std::optional<::mlir::RegisteredOperationName> info =
      odsState.name.getRegisteredInfo();
    if (failed(info->setOpPropertiesFromAttribute(odsState.name, properties,
        odsState.attributes.getDictionary(odsState.getContext()), nullptr)))
      ::llvm::report_fatal_error("Property conversion failed.");
  }
}

void TileMulIOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() == 3u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

::llvm::LogicalResult TileMulIOp::verifyInvariantsImpl() {
  auto tblgen_isZextLhs = getProperties().isZextLhs; (void)tblgen_isZextLhs;
  auto tblgen_isZextRhs = getProperties().isZextRhs; (void)tblgen_isZextRhs;

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMX1(*this, tblgen_isZextLhs, "isZextLhs")))
    return ::mlir::failure();

  if (::mlir::failed(__mlir_ods_local_attr_constraint_AMX1(*this, tblgen_isZextRhs, "isZextRhs")))
    return ::mlir::failure();
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMX6(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMX6(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup2 = getODSOperands(2);

    for (auto v : valueGroup2) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMX7(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSResults(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMX7(*this, v.getType(), "result", index++)))
        return ::mlir::failure();
    }
  }
  if (!((((*this->getODSOperands(2).begin()).getType()) == ((*this->getODSResults(0).begin()).getType()) && ((*this->getODSResults(0).begin()).getType()) == ((*this->getODSOperands(2).begin()).getType()))))
    return emitOpError("failed to verify that all of {acc, res} have same type");
  return ::mlir::success();
}

::llvm::LogicalResult TileMulIOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::mlir::ParseResult TileMulIOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand lhsRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> lhsOperands(&lhsRawOperand, 1);  ::llvm::SMLoc lhsOperandsLoc;
  (void)lhsOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand rhsRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> rhsOperands(&rhsRawOperand, 1);  ::llvm::SMLoc rhsOperandsLoc;
  (void)rhsOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand accRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> accOperands(&accRawOperand, 1);  ::llvm::SMLoc accOperandsLoc;
  (void)accOperandsLoc;
  ::mlir::Type lhsRawType{};
  ::llvm::ArrayRef<::mlir::Type> lhsTypes(&lhsRawType, 1);
  ::mlir::Type rhsRawType{};
  ::llvm::ArrayRef<::mlir::Type> rhsTypes(&rhsRawType, 1);
  ::mlir::Type accRawType{};
  ::llvm::ArrayRef<::mlir::Type> accTypes(&accRawType, 1);

  lhsOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(lhsRawOperand))
    return ::mlir::failure();
  if (::mlir::succeeded(parser.parseOptionalKeyword("zext"))) {
    result.getOrAddProperties<TileMulIOp::Properties>().isZextLhs = parser.getBuilder().getUnitAttr();  }
  if (parser.parseComma())
    return ::mlir::failure();

  rhsOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(rhsRawOperand))
    return ::mlir::failure();
  if (::mlir::succeeded(parser.parseOptionalKeyword("zext"))) {
    result.getOrAddProperties<TileMulIOp::Properties>().isZextRhs = parser.getBuilder().getUnitAttr();  }
  if (parser.parseComma())
    return ::mlir::failure();

  accOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(accRawOperand))
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

  if (parser.parseType(lhsRawType))
    return ::mlir::failure();
  if (parser.parseComma())
    return ::mlir::failure();

  if (parser.parseType(rhsRawType))
    return ::mlir::failure();
  if (parser.parseComma())
    return ::mlir::failure();

  if (parser.parseType(accRawType))
    return ::mlir::failure();
  result.addTypes(accTypes[0]);
  if (parser.resolveOperands(lhsOperands, lhsTypes, lhsOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(rhsOperands, rhsTypes, rhsOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(accOperands, accTypes, accOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void TileMulIOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  _odsPrinter << ' ';
  _odsPrinter << getLhs();
  if ((getIsZextLhsAttr() && getIsZextLhsAttr() != ((false) ? ::mlir::OpBuilder((*this)->getContext()).getUnitAttr() : nullptr))) {
    _odsPrinter << ' ' << "zext";
  }
  _odsPrinter << ",";
  _odsPrinter << ' ';
  _odsPrinter << getRhs();
  if ((getIsZextRhsAttr() && getIsZextRhsAttr() != ((false) ? ::mlir::OpBuilder((*this)->getContext()).getUnitAttr() : nullptr))) {
    _odsPrinter << ' ' << "zext";
  }
  _odsPrinter << ",";
  _odsPrinter << ' ';
  _odsPrinter << getAcc();
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  elidedAttrs.push_back("isZextLhs");
  elidedAttrs.push_back("isZextRhs");
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getIsZextLhsAttr();
     if(attr && (attr == ((false) ? odsBuilder.getUnitAttr() : nullptr)))
       elidedAttrs.push_back("isZextLhs");
  }
  {
     ::mlir::Builder odsBuilder(getContext());
     ::mlir::Attribute attr = getIsZextRhsAttr();
     if(attr && (attr == ((false) ? odsBuilder.getUnitAttr() : nullptr)))
       elidedAttrs.push_back("isZextRhs");
  }
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
   _odsPrinter << getLhs().getType();
  _odsPrinter << ",";
  _odsPrinter << ' ';
   _odsPrinter << getRhs().getType();
  _odsPrinter << ",";
  _odsPrinter << ' ';
   _odsPrinter << getAcc().getType();
}

void TileMulIOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
}

} // namespace amx
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amx::TileMulIOp)

namespace mlir {
namespace amx {

//===----------------------------------------------------------------------===//
// ::mlir::amx::TileStoreOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
TileStoreOpGenericAdaptorBase::TileStoreOpGenericAdaptorBase(TileStoreOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

std::pair<unsigned, unsigned> TileStoreOpGenericAdaptorBase::getODSOperandIndexAndLength(unsigned index, unsigned odsOperandsSize) {
  bool isVariadic[] = {false, true, false};
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

} // namespace detail
TileStoreOpAdaptor::TileStoreOpAdaptor(TileStoreOp op) : TileStoreOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult TileStoreOpAdaptor::verify(::mlir::Location loc) {
  return ::mlir::success();
}

std::pair<unsigned, unsigned> TileStoreOp::getODSOperandIndexAndLength(unsigned index) {
  bool isVariadic[] = {false, true, false};
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

::mlir::MutableOperandRange TileStoreOp::getIndicesMutable() {
  auto range = getODSOperandIndexAndLength(1);
  auto mutableRange = ::mlir::MutableOperandRange(getOperation(), range.first, range.second);
  return mutableRange;
}

::llvm::LogicalResult TileStoreOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }
      return ::mlir::success();
}

::mlir::Attribute TileStoreOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code TileStoreOp::computePropertiesHash(const Properties &prop) {
  using llvm::hash_value;
  return llvm::hash_combine();
}

std::optional<mlir::Attribute> TileStoreOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
  return std::nullopt;
}

void TileStoreOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
}

void TileStoreOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
}

::llvm::LogicalResult TileStoreOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    return ::mlir::success();
}

void TileStoreOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Value base, ::mlir::ValueRange indices, ::mlir::Value val) {
  odsState.addOperands(base);
  odsState.addOperands(indices);
  odsState.addOperands(val);
}

void TileStoreOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::Value base, ::mlir::ValueRange indices, ::mlir::Value val) {
  odsState.addOperands(base);
  odsState.addOperands(indices);
  odsState.addOperands(val);
  assert(resultTypes.size() == 0u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void TileStoreOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 0u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void TileStoreOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() >= 2u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 0u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

::llvm::LogicalResult TileStoreOp::verifyInvariantsImpl() {
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSOperands(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMX1(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup1 = getODSOperands(1);

    for (auto v : valueGroup1) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMX2(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
    auto valueGroup2 = getODSOperands(2);

    for (auto v : valueGroup2) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMX3(*this, v.getType(), "operand", index++)))
        return ::mlir::failure();
    }
  }
  return ::mlir::success();
}

::llvm::LogicalResult TileStoreOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::mlir::ParseResult TileStoreOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
  ::mlir::OpAsmParser::UnresolvedOperand baseRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> baseOperands(&baseRawOperand, 1);  ::llvm::SMLoc baseOperandsLoc;
  (void)baseOperandsLoc;
  ::llvm::SmallVector<::mlir::OpAsmParser::UnresolvedOperand, 4> indicesOperands;
  ::llvm::SMLoc indicesOperandsLoc;
  (void)indicesOperandsLoc;
  ::mlir::OpAsmParser::UnresolvedOperand valRawOperand{};
  ::llvm::ArrayRef<::mlir::OpAsmParser::UnresolvedOperand> valOperands(&valRawOperand, 1);  ::llvm::SMLoc valOperandsLoc;
  (void)valOperandsLoc;
  ::mlir::Type baseRawType{};
  ::llvm::ArrayRef<::mlir::Type> baseTypes(&baseRawType, 1);
  ::mlir::Type valRawType{};
  ::llvm::ArrayRef<::mlir::Type> valTypes(&valRawType, 1);

  baseOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(baseRawOperand))
    return ::mlir::failure();
  if (parser.parseLSquare())
    return ::mlir::failure();

  indicesOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperandList(indicesOperands))
    return ::mlir::failure();
  if (parser.parseRSquare())
    return ::mlir::failure();
  if (parser.parseComma())
    return ::mlir::failure();

  valOperandsLoc = parser.getCurrentLocation();
  if (parser.parseOperand(valRawOperand))
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
    baseRawType = type;
  }
  if (parser.parseComma())
    return ::mlir::failure();

  if (parser.parseType(valRawType))
    return ::mlir::failure();
  ::mlir::Type odsBuildableType0 = parser.getBuilder().getIndexType();
  if (parser.resolveOperands(baseOperands, baseTypes, baseOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(indicesOperands, odsBuildableType0, indicesOperandsLoc, result.operands))
    return ::mlir::failure();
  if (parser.resolveOperands(valOperands, valTypes, valOperandsLoc, result.operands))
    return ::mlir::failure();
  return ::mlir::success();
}

void TileStoreOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  _odsPrinter << ' ';
  _odsPrinter << getBase();
  _odsPrinter << "[";
  _odsPrinter << getIndices();
  _odsPrinter << "]";
  _odsPrinter << ",";
  _odsPrinter << ' ';
  _odsPrinter << getVal();
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
  {
    auto type = getBase().getType();
    if (auto validType = ::llvm::dyn_cast<::mlir::MemRefType>(type))
      _odsPrinter.printStrippedAttrOrType(validType);
   else
     _odsPrinter << type;
  }
  _odsPrinter << ",";
  _odsPrinter << ' ';
   _odsPrinter << getVal().getType();
}

void TileStoreOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
  {
    auto valueRange = getODSOperandIndexAndLength(0);
    for (unsigned idx = valueRange.first; idx < valueRange.first + valueRange.second; idx++) {
      effects.emplace_back(::mlir::MemoryEffects::Write::get(), &getOperation()->getOpOperand(idx), 0, false, ::mlir::SideEffects::DefaultResource::get());
    }
  }
}

} // namespace amx
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amx::TileStoreOp)

namespace mlir {
namespace amx {

//===----------------------------------------------------------------------===//
// ::mlir::amx::TileZeroOp definitions
//===----------------------------------------------------------------------===//

namespace detail {
TileZeroOpGenericAdaptorBase::TileZeroOpGenericAdaptorBase(TileZeroOp op) : odsAttrs(op->getRawDictionaryAttrs()), odsOpName(op->getName()), properties(op.getProperties()), odsRegions(op->getRegions()) {}

} // namespace detail
TileZeroOpAdaptor::TileZeroOpAdaptor(TileZeroOp op) : TileZeroOpGenericAdaptor(op->getOperands(), op) {}

::llvm::LogicalResult TileZeroOpAdaptor::verify(::mlir::Location loc) {
  return ::mlir::success();
}

::llvm::LogicalResult TileZeroOp::setPropertiesFromAttr(Properties &prop, ::mlir::Attribute attr, ::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
  ::mlir::DictionaryAttr dict = ::llvm::dyn_cast<::mlir::DictionaryAttr>(attr);
  if (!dict) {
    emitError() << "expected DictionaryAttr to set properties";
    return ::mlir::failure();
  }
      return ::mlir::success();
}

::mlir::Attribute TileZeroOp::getPropertiesAsAttr(::mlir::MLIRContext *ctx, const Properties &prop) {
    ::mlir::SmallVector<::mlir::NamedAttribute> attrs;
    ::mlir::Builder odsBuilder{ctx};

  if (!attrs.empty())
    return odsBuilder.getDictionaryAttr(attrs);
  return {};
}

llvm::hash_code TileZeroOp::computePropertiesHash(const Properties &prop) {
  using llvm::hash_value;
  return llvm::hash_combine();
}

std::optional<mlir::Attribute> TileZeroOp::getInherentAttr(::mlir::MLIRContext *ctx, const Properties &prop, llvm::StringRef name) {
  return std::nullopt;
}

void TileZeroOp::setInherentAttr(Properties &prop, llvm::StringRef name, mlir::Attribute value) {
}

void TileZeroOp::populateInherentAttrs(::mlir::MLIRContext *ctx, const Properties &prop, ::mlir::NamedAttrList &attrs) {
}

::llvm::LogicalResult TileZeroOp::verifyInherentAttrs(::mlir::OperationName opName, ::mlir::NamedAttrList &attrs, llvm::function_ref<::mlir::InFlightDiagnostic()> emitError) {
    return ::mlir::success();
}

void TileZeroOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::Type res) {
  odsState.addTypes(res);
}

void TileZeroOp::build(::mlir::OpBuilder &odsBuilder, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes) {
  assert(resultTypes.size() == 1u && "mismatched number of results");
  odsState.addTypes(resultTypes);
}

void TileZeroOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, ::llvm::ArrayRef<::mlir::NamedAttribute> attributes) {
  assert(operands.size() == 0u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.addAttributes(attributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

void TileZeroOp::build(::mlir::OpBuilder &, ::mlir::OperationState &odsState, ::mlir::TypeRange resultTypes, ::mlir::ValueRange operands, const Properties &properties, ::llvm::ArrayRef<::mlir::NamedAttribute> discardableAttributes) {
  assert(operands.size() == 0u && "mismatched number of parameters");
  odsState.addOperands(operands);
  odsState.useProperties(const_cast<Properties&>(properties));
  odsState.addAttributes(discardableAttributes);
  assert(resultTypes.size() == 1u && "mismatched number of return types");
  odsState.addTypes(resultTypes);
}

::llvm::LogicalResult TileZeroOp::verifyInvariantsImpl() {
  {
    unsigned index = 0; (void)index;
    auto valueGroup0 = getODSResults(0);

    for (auto v : valueGroup0) {
      if (::mlir::failed(__mlir_ods_local_type_constraint_AMX3(*this, v.getType(), "result", index++)))
        return ::mlir::failure();
    }
  }
  return ::mlir::success();
}

::llvm::LogicalResult TileZeroOp::verifyInvariants() {
  if(::mlir::succeeded(verifyInvariantsImpl()) && ::mlir::succeeded(verify()))
    return ::mlir::success();
  return ::mlir::failure();
}

::mlir::ParseResult TileZeroOp::parse(::mlir::OpAsmParser &parser, ::mlir::OperationState &result) {
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
  if (parser.parseColon())
    return ::mlir::failure();

  if (parser.parseType(resRawType))
    return ::mlir::failure();
  result.addTypes(resTypes);
  return ::mlir::success();
}

void TileZeroOp::print(::mlir::OpAsmPrinter &_odsPrinter) {
  ::llvm::SmallVector<::llvm::StringRef, 2> elidedAttrs;
  _odsPrinter.printOptionalAttrDict((*this)->getAttrs(), elidedAttrs);
  _odsPrinter << ' ' << ":";
  _odsPrinter << ' ';
   _odsPrinter << getRes().getType();
}

void TileZeroOp::getEffects(::llvm::SmallVectorImpl<::mlir::SideEffects::EffectInstance<::mlir::MemoryEffects::Effect>> &effects) {
}

} // namespace amx
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::amx::TileZeroOp)


#endif  // GET_OP_CLASSES

