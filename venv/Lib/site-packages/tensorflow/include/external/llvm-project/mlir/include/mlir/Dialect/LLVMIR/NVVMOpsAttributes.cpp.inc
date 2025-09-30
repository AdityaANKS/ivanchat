/*===- TableGen'erated file -------------------------------------*- C++ -*-===*\
|*                                                                            *|
|* AttrDef Definitions                                                        *|
|*                                                                            *|
|* Automatically generated file, do not edit!                                 *|
|*                                                                            *|
\*===----------------------------------------------------------------------===*/

#ifdef GET_ATTRDEF_LIST
#undef GET_ATTRDEF_LIST

::mlir::NVVM::CacheEvictionPriorityAttr,
::mlir::NVVM::ReduxKindAttr,
::mlir::NVVM::SharedSpaceAttr,
::mlir::NVVM::ProxyKindAttr,
::mlir::NVVM::MemScopeKindAttr,
::mlir::NVVM::SetMaxRegisterActionAttr,
::mlir::NVVM::ShflKindAttr,
::mlir::NVVM::VoteSyncKindAttr,
::mlir::NVVM::LoadCacheModifierKindAttr,
::mlir::NVVM::FPRoundingModeAttr,
::mlir::NVVM::SaturationModeAttr,
::mlir::NVVM::ConvertFP6TypeAttr,
::mlir::NVVM::ConvertFP8TypeAttr,
::mlir::NVVM::MMAB1OpAttr,
::mlir::NVVM::MMAIntOverflowAttr,
::mlir::NVVM::MMAShapeAttr,
::mlir::NVVM::MMALayoutAttr,
::mlir::NVVM::MMATypesAttr,
::mlir::NVVM::MMAFragAttr,
::mlir::NVVM::PrefetchCacheLevelAttr,
::mlir::NVVM::TMAStoreModeAttr,
::mlir::NVVM::TMAReduxKindAttr,
::mlir::NVVM::WGMMAScaleInAttr,
::mlir::NVVM::WGMMAScaleOutAttr,
::mlir::NVVM::WGMMATypesAttr,
::mlir::NVVM::MatchSyncKindAttr,
::mlir::NVVM::Tcgen05GroupKindAttr,
::mlir::NVVM::Tcgen05FenceKindAttr,
::mlir::NVVM::Tcgen05WaitKindAttr,
::mlir::NVVM::Tcgen05CpShapeAttr,
::mlir::NVVM::Tcgen05CpMulticastAttr,
::mlir::NVVM::Tcgen05CpSrcFormatAttr,
::mlir::NVVM::Tcgen05LdStShapeAttr,
::mlir::NVVM::DotAccumulateTypeAttr,
::mlir::NVVM::NVVMTargetAttr

#endif  // GET_ATTRDEF_LIST

#ifdef GET_ATTRDEF_CLASSES
#undef GET_ATTRDEF_CLASSES

static ::mlir::OptionalParseResult generatedAttributeParser(::mlir::AsmParser &parser, ::llvm::StringRef *mnemonic, ::mlir::Type type, ::mlir::Attribute &value) {
  return ::mlir::AsmParser::KeywordSwitch<::mlir::OptionalParseResult>(parser)
    .Case(::mlir::NVVM::CacheEvictionPriorityAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::CacheEvictionPriorityAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::ReduxKindAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::ReduxKindAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::SharedSpaceAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::SharedSpaceAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::ProxyKindAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::ProxyKindAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::MemScopeKindAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::MemScopeKindAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::SetMaxRegisterActionAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::SetMaxRegisterActionAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::ShflKindAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::ShflKindAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::VoteSyncKindAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::VoteSyncKindAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::LoadCacheModifierKindAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::LoadCacheModifierKindAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::FPRoundingModeAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::FPRoundingModeAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::SaturationModeAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::SaturationModeAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::ConvertFP6TypeAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::ConvertFP6TypeAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::ConvertFP8TypeAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::ConvertFP8TypeAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::MMAB1OpAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::MMAB1OpAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::MMAIntOverflowAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::MMAIntOverflowAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::MMAShapeAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::MMAShapeAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::MMALayoutAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::MMALayoutAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::MMATypesAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::MMATypesAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::MMAFragAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::MMAFragAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::PrefetchCacheLevelAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::PrefetchCacheLevelAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::TMAStoreModeAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::TMAStoreModeAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::TMAReduxKindAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::TMAReduxKindAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::WGMMAScaleInAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::WGMMAScaleInAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::WGMMAScaleOutAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::WGMMAScaleOutAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::WGMMATypesAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::WGMMATypesAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::MatchSyncKindAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::MatchSyncKindAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::Tcgen05GroupKindAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::Tcgen05GroupKindAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::Tcgen05FenceKindAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::Tcgen05FenceKindAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::Tcgen05WaitKindAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::Tcgen05WaitKindAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::Tcgen05CpShapeAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::Tcgen05CpShapeAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::Tcgen05CpMulticastAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::Tcgen05CpMulticastAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::Tcgen05CpSrcFormatAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::Tcgen05CpSrcFormatAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::Tcgen05LdStShapeAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::Tcgen05LdStShapeAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::DotAccumulateTypeAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::DotAccumulateTypeAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Case(::mlir::NVVM::NVVMTargetAttr::getMnemonic(), [&](llvm::StringRef, llvm::SMLoc) {
      value = ::mlir::NVVM::NVVMTargetAttr::parse(parser, type);
      return ::mlir::success(!!value);
    })
    .Default([&](llvm::StringRef keyword, llvm::SMLoc) {
      *mnemonic = keyword;
      return std::nullopt;
    });
}

static ::llvm::LogicalResult generatedAttributePrinter(::mlir::Attribute def, ::mlir::AsmPrinter &printer) {
  return ::llvm::TypeSwitch<::mlir::Attribute, ::llvm::LogicalResult>(def)    .Case<::mlir::NVVM::CacheEvictionPriorityAttr>([&](auto t) {
      printer << ::mlir::NVVM::CacheEvictionPriorityAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::ReduxKindAttr>([&](auto t) {
      printer << ::mlir::NVVM::ReduxKindAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::SharedSpaceAttr>([&](auto t) {
      printer << ::mlir::NVVM::SharedSpaceAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::ProxyKindAttr>([&](auto t) {
      printer << ::mlir::NVVM::ProxyKindAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::MemScopeKindAttr>([&](auto t) {
      printer << ::mlir::NVVM::MemScopeKindAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::SetMaxRegisterActionAttr>([&](auto t) {
      printer << ::mlir::NVVM::SetMaxRegisterActionAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::ShflKindAttr>([&](auto t) {
      printer << ::mlir::NVVM::ShflKindAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::VoteSyncKindAttr>([&](auto t) {
      printer << ::mlir::NVVM::VoteSyncKindAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::LoadCacheModifierKindAttr>([&](auto t) {
      printer << ::mlir::NVVM::LoadCacheModifierKindAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::FPRoundingModeAttr>([&](auto t) {
      printer << ::mlir::NVVM::FPRoundingModeAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::SaturationModeAttr>([&](auto t) {
      printer << ::mlir::NVVM::SaturationModeAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::ConvertFP6TypeAttr>([&](auto t) {
      printer << ::mlir::NVVM::ConvertFP6TypeAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::ConvertFP8TypeAttr>([&](auto t) {
      printer << ::mlir::NVVM::ConvertFP8TypeAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::MMAB1OpAttr>([&](auto t) {
      printer << ::mlir::NVVM::MMAB1OpAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::MMAIntOverflowAttr>([&](auto t) {
      printer << ::mlir::NVVM::MMAIntOverflowAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::MMAShapeAttr>([&](auto t) {
      printer << ::mlir::NVVM::MMAShapeAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::MMALayoutAttr>([&](auto t) {
      printer << ::mlir::NVVM::MMALayoutAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::MMATypesAttr>([&](auto t) {
      printer << ::mlir::NVVM::MMATypesAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::MMAFragAttr>([&](auto t) {
      printer << ::mlir::NVVM::MMAFragAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::PrefetchCacheLevelAttr>([&](auto t) {
      printer << ::mlir::NVVM::PrefetchCacheLevelAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::TMAStoreModeAttr>([&](auto t) {
      printer << ::mlir::NVVM::TMAStoreModeAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::TMAReduxKindAttr>([&](auto t) {
      printer << ::mlir::NVVM::TMAReduxKindAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::WGMMAScaleInAttr>([&](auto t) {
      printer << ::mlir::NVVM::WGMMAScaleInAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::WGMMAScaleOutAttr>([&](auto t) {
      printer << ::mlir::NVVM::WGMMAScaleOutAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::WGMMATypesAttr>([&](auto t) {
      printer << ::mlir::NVVM::WGMMATypesAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::MatchSyncKindAttr>([&](auto t) {
      printer << ::mlir::NVVM::MatchSyncKindAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::Tcgen05GroupKindAttr>([&](auto t) {
      printer << ::mlir::NVVM::Tcgen05GroupKindAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::Tcgen05FenceKindAttr>([&](auto t) {
      printer << ::mlir::NVVM::Tcgen05FenceKindAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::Tcgen05WaitKindAttr>([&](auto t) {
      printer << ::mlir::NVVM::Tcgen05WaitKindAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::Tcgen05CpShapeAttr>([&](auto t) {
      printer << ::mlir::NVVM::Tcgen05CpShapeAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::Tcgen05CpMulticastAttr>([&](auto t) {
      printer << ::mlir::NVVM::Tcgen05CpMulticastAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::Tcgen05CpSrcFormatAttr>([&](auto t) {
      printer << ::mlir::NVVM::Tcgen05CpSrcFormatAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::Tcgen05LdStShapeAttr>([&](auto t) {
      printer << ::mlir::NVVM::Tcgen05LdStShapeAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::DotAccumulateTypeAttr>([&](auto t) {
      printer << ::mlir::NVVM::DotAccumulateTypeAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Case<::mlir::NVVM::NVVMTargetAttr>([&](auto t) {
      printer << ::mlir::NVVM::NVVMTargetAttr::getMnemonic();
t.print(printer);
      return ::mlir::success();
    })
    .Default([](auto) { return ::mlir::failure(); });
}

namespace mlir {
namespace NVVM {
namespace detail {
struct CacheEvictionPriorityAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::CacheEvictionPriority>;
  CacheEvictionPriorityAttrStorage(::mlir::NVVM::CacheEvictionPriority value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static CacheEvictionPriorityAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<CacheEvictionPriorityAttrStorage>()) CacheEvictionPriorityAttrStorage(std::move(value));
  }

  ::mlir::NVVM::CacheEvictionPriority value;
};
} // namespace detail
CacheEvictionPriorityAttr CacheEvictionPriorityAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::CacheEvictionPriority value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute CacheEvictionPriorityAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::CacheEvictionPriority> _result_value;

  // Parse variable 'value'
  _result_value = ::mlir::FieldParser<::mlir::NVVM::CacheEvictionPriority>::parse(odsParser);
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse CacheEvictionPriorityAttr parameter 'value' which is to be a `::mlir::NVVM::CacheEvictionPriority`");
    return {};
  }
  assert(::mlir::succeeded(_result_value));
  return CacheEvictionPriorityAttr::get(odsParser.getContext(),
      ::mlir::NVVM::CacheEvictionPriority((*_result_value)));
}

void CacheEvictionPriorityAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << ' ';
  odsPrinter.printStrippedAttrOrType(getValue());
}

::mlir::NVVM::CacheEvictionPriority CacheEvictionPriorityAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::CacheEvictionPriorityAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct ReduxKindAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::ReduxKind>;
  ReduxKindAttrStorage(::mlir::NVVM::ReduxKind value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static ReduxKindAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<ReduxKindAttrStorage>()) ReduxKindAttrStorage(std::move(value));
  }

  ::mlir::NVVM::ReduxKind value;
};
} // namespace detail
ReduxKindAttr ReduxKindAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::ReduxKind value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute ReduxKindAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::ReduxKind> _result_value;

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::ReduxKind> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeReduxKind(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::ReduxKind" << " to be one of: " << "add" << ", " << "and" << ", " << "max" << ", " << "min" << ", " << "or" << ", " << "umax" << ", " << "umin" << ", " << "xor" << ", " << "fmin" << ", " << "fmax")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse ReduxKindAttr parameter 'value' which is to be a `::mlir::NVVM::ReduxKind`");
    return {};
  }
  assert(::mlir::succeeded(_result_value));
  return ReduxKindAttr::get(odsParser.getContext(),
      ::mlir::NVVM::ReduxKind((*_result_value)));
}

void ReduxKindAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << ' ';
  odsPrinter << stringifyReduxKind(getValue());
}

::mlir::NVVM::ReduxKind ReduxKindAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::ReduxKindAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct SharedSpaceAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::SharedSpace>;
  SharedSpaceAttrStorage(::mlir::NVVM::SharedSpace value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static SharedSpaceAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<SharedSpaceAttrStorage>()) SharedSpaceAttrStorage(std::move(value));
  }

  ::mlir::NVVM::SharedSpace value;
};
} // namespace detail
SharedSpaceAttr SharedSpaceAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::SharedSpace value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute SharedSpaceAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::SharedSpace> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::SharedSpace> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeSharedSpace(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::SharedSpace" << " to be one of: " << "cta" << ", " << "cluster")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse SharedSpaceAttr parameter 'value' which is to be a `::mlir::NVVM::SharedSpace`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return SharedSpaceAttr::get(odsParser.getContext(),
      ::mlir::NVVM::SharedSpace((*_result_value)));
}

void SharedSpaceAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifySharedSpace(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::SharedSpace SharedSpaceAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::SharedSpaceAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct ProxyKindAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::ProxyKind>;
  ProxyKindAttrStorage(::mlir::NVVM::ProxyKind value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static ProxyKindAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<ProxyKindAttrStorage>()) ProxyKindAttrStorage(std::move(value));
  }

  ::mlir::NVVM::ProxyKind value;
};
} // namespace detail
ProxyKindAttr ProxyKindAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::ProxyKind value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute ProxyKindAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::ProxyKind> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::ProxyKind> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeProxyKind(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::ProxyKind" << " to be one of: " << "alias" << ", " << "async" << ", " << "async.global" << ", " << "async.shared" << ", " << "tensormap" << ", " << "generic")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse ProxyKindAttr parameter 'value' which is to be a `::mlir::NVVM::ProxyKind`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return ProxyKindAttr::get(odsParser.getContext(),
      ::mlir::NVVM::ProxyKind((*_result_value)));
}

void ProxyKindAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyProxyKind(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::ProxyKind ProxyKindAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::ProxyKindAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct MemScopeKindAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::MemScopeKind>;
  MemScopeKindAttrStorage(::mlir::NVVM::MemScopeKind value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static MemScopeKindAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<MemScopeKindAttrStorage>()) MemScopeKindAttrStorage(std::move(value));
  }

  ::mlir::NVVM::MemScopeKind value;
};
} // namespace detail
MemScopeKindAttr MemScopeKindAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::MemScopeKind value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute MemScopeKindAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::MemScopeKind> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::MemScopeKind> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeMemScopeKind(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::MemScopeKind" << " to be one of: " << "cta" << ", " << "cluster" << ", " << "gpu" << ", " << "sys")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse MemScopeKindAttr parameter 'value' which is to be a `::mlir::NVVM::MemScopeKind`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return MemScopeKindAttr::get(odsParser.getContext(),
      ::mlir::NVVM::MemScopeKind((*_result_value)));
}

void MemScopeKindAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyMemScopeKind(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::MemScopeKind MemScopeKindAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::MemScopeKindAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct SetMaxRegisterActionAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::SetMaxRegisterAction>;
  SetMaxRegisterActionAttrStorage(::mlir::NVVM::SetMaxRegisterAction value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static SetMaxRegisterActionAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<SetMaxRegisterActionAttrStorage>()) SetMaxRegisterActionAttrStorage(std::move(value));
  }

  ::mlir::NVVM::SetMaxRegisterAction value;
};
} // namespace detail
SetMaxRegisterActionAttr SetMaxRegisterActionAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::SetMaxRegisterAction value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute SetMaxRegisterActionAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::SetMaxRegisterAction> _result_value;

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::SetMaxRegisterAction> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeSetMaxRegisterAction(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::SetMaxRegisterAction" << " to be one of: " << "decrease" << ", " << "increase")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse SetMaxRegisterActionAttr parameter 'value' which is to be a `::mlir::NVVM::SetMaxRegisterAction`");
    return {};
  }
  assert(::mlir::succeeded(_result_value));
  return SetMaxRegisterActionAttr::get(odsParser.getContext(),
      ::mlir::NVVM::SetMaxRegisterAction((*_result_value)));
}

void SetMaxRegisterActionAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << ' ';
  odsPrinter << stringifySetMaxRegisterAction(getValue());
}

::mlir::NVVM::SetMaxRegisterAction SetMaxRegisterActionAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::SetMaxRegisterActionAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct ShflKindAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::ShflKind>;
  ShflKindAttrStorage(::mlir::NVVM::ShflKind value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static ShflKindAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<ShflKindAttrStorage>()) ShflKindAttrStorage(std::move(value));
  }

  ::mlir::NVVM::ShflKind value;
};
} // namespace detail
ShflKindAttr ShflKindAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::ShflKind value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute ShflKindAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::ShflKind> _result_value;

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::ShflKind> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeShflKind(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::ShflKind" << " to be one of: " << "bfly" << ", " << "up" << ", " << "down" << ", " << "idx")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse ShflKindAttr parameter 'value' which is to be a `::mlir::NVVM::ShflKind`");
    return {};
  }
  assert(::mlir::succeeded(_result_value));
  return ShflKindAttr::get(odsParser.getContext(),
      ::mlir::NVVM::ShflKind((*_result_value)));
}

void ShflKindAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << ' ';
  odsPrinter << stringifyShflKind(getValue());
}

::mlir::NVVM::ShflKind ShflKindAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::ShflKindAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct VoteSyncKindAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::VoteSyncKind>;
  VoteSyncKindAttrStorage(::mlir::NVVM::VoteSyncKind value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static VoteSyncKindAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<VoteSyncKindAttrStorage>()) VoteSyncKindAttrStorage(std::move(value));
  }

  ::mlir::NVVM::VoteSyncKind value;
};
} // namespace detail
VoteSyncKindAttr VoteSyncKindAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::VoteSyncKind value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute VoteSyncKindAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::VoteSyncKind> _result_value;

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::VoteSyncKind> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeVoteSyncKind(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::VoteSyncKind" << " to be one of: " << "any" << ", " << "all" << ", " << "ballot" << ", " << "uni")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse VoteSyncKindAttr parameter 'value' which is to be a `::mlir::NVVM::VoteSyncKind`");
    return {};
  }
  assert(::mlir::succeeded(_result_value));
  return VoteSyncKindAttr::get(odsParser.getContext(),
      ::mlir::NVVM::VoteSyncKind((*_result_value)));
}

void VoteSyncKindAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << ' ';
  odsPrinter << stringifyVoteSyncKind(getValue());
}

::mlir::NVVM::VoteSyncKind VoteSyncKindAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::VoteSyncKindAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct LoadCacheModifierKindAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::LoadCacheModifierKind>;
  LoadCacheModifierKindAttrStorage(::mlir::NVVM::LoadCacheModifierKind value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static LoadCacheModifierKindAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<LoadCacheModifierKindAttrStorage>()) LoadCacheModifierKindAttrStorage(std::move(value));
  }

  ::mlir::NVVM::LoadCacheModifierKind value;
};
} // namespace detail
LoadCacheModifierKindAttr LoadCacheModifierKindAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::LoadCacheModifierKind value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute LoadCacheModifierKindAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::LoadCacheModifierKind> _result_value;

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::LoadCacheModifierKind> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeLoadCacheModifierKind(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::LoadCacheModifierKind" << " to be one of: " << "ca" << ", " << "cg" << ", " << "cs" << ", " << "lu" << ", " << "cv")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse LoadCacheModifierAttr parameter 'value' which is to be a `::mlir::NVVM::LoadCacheModifierKind`");
    return {};
  }
  assert(::mlir::succeeded(_result_value));
  return LoadCacheModifierKindAttr::get(odsParser.getContext(),
      ::mlir::NVVM::LoadCacheModifierKind((*_result_value)));
}

void LoadCacheModifierKindAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << ' ';
  odsPrinter << stringifyLoadCacheModifierKind(getValue());
}

::mlir::NVVM::LoadCacheModifierKind LoadCacheModifierKindAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::LoadCacheModifierKindAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct FPRoundingModeAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::FPRoundingMode>;
  FPRoundingModeAttrStorage(::mlir::NVVM::FPRoundingMode value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static FPRoundingModeAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<FPRoundingModeAttrStorage>()) FPRoundingModeAttrStorage(std::move(value));
  }

  ::mlir::NVVM::FPRoundingMode value;
};
} // namespace detail
FPRoundingModeAttr FPRoundingModeAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::FPRoundingMode value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute FPRoundingModeAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::FPRoundingMode> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::FPRoundingMode> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeFPRoundingMode(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::FPRoundingMode" << " to be one of: " << "none" << ", " << "rn" << ", " << "rm" << ", " << "rp" << ", " << "rz" << ", " << "rna")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse FPRoundingModeAttr parameter 'value' which is to be a `::mlir::NVVM::FPRoundingMode`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return FPRoundingModeAttr::get(odsParser.getContext(),
      ::mlir::NVVM::FPRoundingMode((*_result_value)));
}

void FPRoundingModeAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyFPRoundingMode(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::FPRoundingMode FPRoundingModeAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::FPRoundingModeAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct SaturationModeAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::SaturationMode>;
  SaturationModeAttrStorage(::mlir::NVVM::SaturationMode value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static SaturationModeAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<SaturationModeAttrStorage>()) SaturationModeAttrStorage(std::move(value));
  }

  ::mlir::NVVM::SaturationMode value;
};
} // namespace detail
SaturationModeAttr SaturationModeAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::SaturationMode value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute SaturationModeAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::SaturationMode> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::SaturationMode> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeSaturationMode(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::SaturationMode" << " to be one of: " << "none" << ", " << "satfinite")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse SaturationModeAttr parameter 'value' which is to be a `::mlir::NVVM::SaturationMode`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return SaturationModeAttr::get(odsParser.getContext(),
      ::mlir::NVVM::SaturationMode((*_result_value)));
}

void SaturationModeAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifySaturationMode(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::SaturationMode SaturationModeAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::SaturationModeAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct ConvertFP6TypeAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::ConvertFP6Type>;
  ConvertFP6TypeAttrStorage(::mlir::NVVM::ConvertFP6Type value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static ConvertFP6TypeAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<ConvertFP6TypeAttrStorage>()) ConvertFP6TypeAttrStorage(std::move(value));
  }

  ::mlir::NVVM::ConvertFP6Type value;
};
} // namespace detail
ConvertFP6TypeAttr ConvertFP6TypeAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::ConvertFP6Type value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute ConvertFP6TypeAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::ConvertFP6Type> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::ConvertFP6Type> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeConvertFP6Type(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::ConvertFP6Type" << " to be one of: " << "e2m3" << ", " << "e3m2")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse ConvertFP6TypeAttr parameter 'value' which is to be a `::mlir::NVVM::ConvertFP6Type`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return ConvertFP6TypeAttr::get(odsParser.getContext(),
      ::mlir::NVVM::ConvertFP6Type((*_result_value)));
}

void ConvertFP6TypeAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyConvertFP6Type(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::ConvertFP6Type ConvertFP6TypeAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::ConvertFP6TypeAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct ConvertFP8TypeAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::ConvertFP8Type>;
  ConvertFP8TypeAttrStorage(::mlir::NVVM::ConvertFP8Type value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static ConvertFP8TypeAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<ConvertFP8TypeAttrStorage>()) ConvertFP8TypeAttrStorage(std::move(value));
  }

  ::mlir::NVVM::ConvertFP8Type value;
};
} // namespace detail
ConvertFP8TypeAttr ConvertFP8TypeAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::ConvertFP8Type value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute ConvertFP8TypeAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::ConvertFP8Type> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::ConvertFP8Type> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeConvertFP8Type(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::ConvertFP8Type" << " to be one of: " << "e4m3" << ", " << "e5m2" << ", " << "ue8m0")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse ConvertFP8TypeAttr parameter 'value' which is to be a `::mlir::NVVM::ConvertFP8Type`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return ConvertFP8TypeAttr::get(odsParser.getContext(),
      ::mlir::NVVM::ConvertFP8Type((*_result_value)));
}

void ConvertFP8TypeAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyConvertFP8Type(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::ConvertFP8Type ConvertFP8TypeAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::ConvertFP8TypeAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct MMAB1OpAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::MMAB1Op>;
  MMAB1OpAttrStorage(::mlir::NVVM::MMAB1Op value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static MMAB1OpAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<MMAB1OpAttrStorage>()) MMAB1OpAttrStorage(std::move(value));
  }

  ::mlir::NVVM::MMAB1Op value;
};
} // namespace detail
MMAB1OpAttr MMAB1OpAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::MMAB1Op value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute MMAB1OpAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::MMAB1Op> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::MMAB1Op> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeMMAB1Op(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::MMAB1Op" << " to be one of: " << "none" << ", " << "xor_popc" << ", " << "and_popc")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse MMAB1OpAttr parameter 'value' which is to be a `::mlir::NVVM::MMAB1Op`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return MMAB1OpAttr::get(odsParser.getContext(),
      ::mlir::NVVM::MMAB1Op((*_result_value)));
}

void MMAB1OpAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyMMAB1Op(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::MMAB1Op MMAB1OpAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::MMAB1OpAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct MMAIntOverflowAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::MMAIntOverflow>;
  MMAIntOverflowAttrStorage(::mlir::NVVM::MMAIntOverflow value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static MMAIntOverflowAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<MMAIntOverflowAttrStorage>()) MMAIntOverflowAttrStorage(std::move(value));
  }

  ::mlir::NVVM::MMAIntOverflow value;
};
} // namespace detail
MMAIntOverflowAttr MMAIntOverflowAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::MMAIntOverflow value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute MMAIntOverflowAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::MMAIntOverflow> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::MMAIntOverflow> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeMMAIntOverflow(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::MMAIntOverflow" << " to be one of: " << "satfinite" << ", " << "wrapped")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse MMAIntOverflowAttr parameter 'value' which is to be a `::mlir::NVVM::MMAIntOverflow`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return MMAIntOverflowAttr::get(odsParser.getContext(),
      ::mlir::NVVM::MMAIntOverflow((*_result_value)));
}

void MMAIntOverflowAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyMMAIntOverflow(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::MMAIntOverflow MMAIntOverflowAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::MMAIntOverflowAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct MMAShapeAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<int, int, int>;
  MMAShapeAttrStorage(int m, int n, int k) : m(std::move(m)), n(std::move(n)), k(std::move(k)) {}

  KeyTy getAsKey() const {
    return KeyTy(m, n, k);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (m == std::get<0>(tblgenKey)) && (n == std::get<1>(tblgenKey)) && (k == std::get<2>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey), std::get<1>(tblgenKey), std::get<2>(tblgenKey));
  }

  static MMAShapeAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto m = std::move(std::get<0>(tblgenKey));
    auto n = std::move(std::get<1>(tblgenKey));
    auto k = std::move(std::get<2>(tblgenKey));
    return new (allocator.allocate<MMAShapeAttrStorage>()) MMAShapeAttrStorage(std::move(m), std::move(n), std::move(k));
  }

  int m;
  int n;
  int k;
};
} // namespace detail
MMAShapeAttr MMAShapeAttr::get(::mlir::MLIRContext *context, int m, int n, int k) {
  return Base::get(context, std::move(m), std::move(n), std::move(k));
}

::mlir::Attribute MMAShapeAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<int> _result_m;
  ::mlir::FailureOr<int> _result_n;
  ::mlir::FailureOr<int> _result_k;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};
  // Parse parameter struct
  bool _seen_m = false;
  bool _seen_n = false;
  bool _seen_k = false;
  {
    const auto _loop_body = [&](::llvm::StringRef _paramKey) -> bool {
      // Parse literal '='
      if (odsParser.parseEqual()) return {};
      if (!_seen_m && _paramKey == "m") {
        _seen_m = true;

        // Parse variable 'm'
        _result_m = ::mlir::FieldParser<int>::parse(odsParser);
        if (::mlir::failed(_result_m)) {
          odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse NVVM_MMAShapeAttr parameter 'm' which is to be a `int`");
          return {};
        }
      } else if (!_seen_n && _paramKey == "n") {
        _seen_n = true;

        // Parse variable 'n'
        _result_n = ::mlir::FieldParser<int>::parse(odsParser);
        if (::mlir::failed(_result_n)) {
          odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse NVVM_MMAShapeAttr parameter 'n' which is to be a `int`");
          return {};
        }
      } else if (!_seen_k && _paramKey == "k") {
        _seen_k = true;

        // Parse variable 'k'
        _result_k = ::mlir::FieldParser<int>::parse(odsParser);
        if (::mlir::failed(_result_k)) {
          odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse NVVM_MMAShapeAttr parameter 'k' which is to be a `int`");
          return {};
        }
      } else {
        odsParser.emitError(odsParser.getCurrentLocation(), "duplicate or unknown struct parameter name: ") << _paramKey;
        return {};
      }
      return true;
    };
    for (unsigned odsStructIndex = 0; odsStructIndex < 3; ++odsStructIndex) {
      ::llvm::StringRef _paramKey;
      if (odsParser.parseKeyword(&_paramKey)) {
        odsParser.emitError(odsParser.getCurrentLocation(),
                           "expected a parameter name in struct");
        return {};
      }
      if (!_loop_body(_paramKey)) return {};
      if ((odsStructIndex != 3 - 1) && odsParser.parseComma())
        return {};
    }
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_m));
  assert(::mlir::succeeded(_result_n));
  assert(::mlir::succeeded(_result_k));
  return MMAShapeAttr::get(odsParser.getContext(),
      int((*_result_m)),
      int((*_result_n)),
      int((*_result_k)));
}

void MMAShapeAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  {
    bool _firstPrinted = true;
    if (!_firstPrinted) odsPrinter << ", ";
    _firstPrinted = false;
    odsPrinter << "m = ";
    odsPrinter.printStrippedAttrOrType(getM());
    if (!_firstPrinted) odsPrinter << ", ";
    _firstPrinted = false;
    odsPrinter << "n = ";
    odsPrinter.printStrippedAttrOrType(getN());
    if (!_firstPrinted) odsPrinter << ", ";
    _firstPrinted = false;
    odsPrinter << "k = ";
    odsPrinter.printStrippedAttrOrType(getK());
  }
  odsPrinter << ">";
}

int MMAShapeAttr::getM() const {
  return getImpl()->m;
}

int MMAShapeAttr::getN() const {
  return getImpl()->n;
}

int MMAShapeAttr::getK() const {
  return getImpl()->k;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::MMAShapeAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct MMALayoutAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::MMALayout>;
  MMALayoutAttrStorage(::mlir::NVVM::MMALayout value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static MMALayoutAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<MMALayoutAttrStorage>()) MMALayoutAttrStorage(std::move(value));
  }

  ::mlir::NVVM::MMALayout value;
};
} // namespace detail
MMALayoutAttr MMALayoutAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::MMALayout value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute MMALayoutAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::MMALayout> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::MMALayout> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeMMALayout(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::MMALayout" << " to be one of: " << "row" << ", " << "col")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse MMALayoutAttr parameter 'value' which is to be a `::mlir::NVVM::MMALayout`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return MMALayoutAttr::get(odsParser.getContext(),
      ::mlir::NVVM::MMALayout((*_result_value)));
}

void MMALayoutAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyMMALayout(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::MMALayout MMALayoutAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::MMALayoutAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct MMATypesAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::MMATypes>;
  MMATypesAttrStorage(::mlir::NVVM::MMATypes value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static MMATypesAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<MMATypesAttrStorage>()) MMATypesAttrStorage(std::move(value));
  }

  ::mlir::NVVM::MMATypes value;
};
} // namespace detail
MMATypesAttr MMATypesAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::MMATypes value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute MMATypesAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::MMATypes> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::MMATypes> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeMMATypes(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::MMATypes" << " to be one of: " << "f16" << ", " << "f32" << ", " << "tf32" << ", " << "bf16" << ", " << "s8" << ", " << "u8" << ", " << "s32" << ", " << "s4" << ", " << "u4" << ", " << "b1" << ", " << "f64")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse MMATypesAttr parameter 'value' which is to be a `::mlir::NVVM::MMATypes`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return MMATypesAttr::get(odsParser.getContext(),
      ::mlir::NVVM::MMATypes((*_result_value)));
}

void MMATypesAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyMMATypes(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::MMATypes MMATypesAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::MMATypesAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct MMAFragAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::MMAFrag>;
  MMAFragAttrStorage(::mlir::NVVM::MMAFrag value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static MMAFragAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<MMAFragAttrStorage>()) MMAFragAttrStorage(std::move(value));
  }

  ::mlir::NVVM::MMAFrag value;
};
} // namespace detail
MMAFragAttr MMAFragAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::MMAFrag value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute MMAFragAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::MMAFrag> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::MMAFrag> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeMMAFrag(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::MMAFrag" << " to be one of: " << "a" << ", " << "b" << ", " << "c")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse MMAFragAttr parameter 'value' which is to be a `::mlir::NVVM::MMAFrag`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return MMAFragAttr::get(odsParser.getContext(),
      ::mlir::NVVM::MMAFrag((*_result_value)));
}

void MMAFragAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyMMAFrag(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::MMAFrag MMAFragAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::MMAFragAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct PrefetchCacheLevelAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::PrefetchCacheLevel>;
  PrefetchCacheLevelAttrStorage(::mlir::NVVM::PrefetchCacheLevel value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static PrefetchCacheLevelAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<PrefetchCacheLevelAttrStorage>()) PrefetchCacheLevelAttrStorage(std::move(value));
  }

  ::mlir::NVVM::PrefetchCacheLevel value;
};
} // namespace detail
PrefetchCacheLevelAttr PrefetchCacheLevelAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::PrefetchCacheLevel value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute PrefetchCacheLevelAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::PrefetchCacheLevel> _result_value;

  // Parse variable 'value'
  _result_value = ::mlir::FieldParser<::mlir::NVVM::PrefetchCacheLevel>::parse(odsParser);
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse PrefetchCacheLevelAttr parameter 'value' which is to be a `::mlir::NVVM::PrefetchCacheLevel`");
    return {};
  }
  assert(::mlir::succeeded(_result_value));
  return PrefetchCacheLevelAttr::get(odsParser.getContext(),
      ::mlir::NVVM::PrefetchCacheLevel((*_result_value)));
}

void PrefetchCacheLevelAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << ' ';
  odsPrinter.printStrippedAttrOrType(getValue());
}

::mlir::NVVM::PrefetchCacheLevel PrefetchCacheLevelAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::PrefetchCacheLevelAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct TMAStoreModeAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::TMAStoreMode>;
  TMAStoreModeAttrStorage(::mlir::NVVM::TMAStoreMode value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static TMAStoreModeAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<TMAStoreModeAttrStorage>()) TMAStoreModeAttrStorage(std::move(value));
  }

  ::mlir::NVVM::TMAStoreMode value;
};
} // namespace detail
TMAStoreModeAttr TMAStoreModeAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::TMAStoreMode value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute TMAStoreModeAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::TMAStoreMode> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::TMAStoreMode> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeTMAStoreMode(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::TMAStoreMode" << " to be one of: " << "tile" << ", " << "im2col")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse TMAStoreModeAttr parameter 'value' which is to be a `::mlir::NVVM::TMAStoreMode`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return TMAStoreModeAttr::get(odsParser.getContext(),
      ::mlir::NVVM::TMAStoreMode((*_result_value)));
}

void TMAStoreModeAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyTMAStoreMode(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::TMAStoreMode TMAStoreModeAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::TMAStoreModeAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct TMAReduxKindAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::TMAReduxKind>;
  TMAReduxKindAttrStorage(::mlir::NVVM::TMAReduxKind value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static TMAReduxKindAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<TMAReduxKindAttrStorage>()) TMAReduxKindAttrStorage(std::move(value));
  }

  ::mlir::NVVM::TMAReduxKind value;
};
} // namespace detail
TMAReduxKindAttr TMAReduxKindAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::TMAReduxKind value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute TMAReduxKindAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::TMAReduxKind> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::TMAReduxKind> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeTMAReduxKind(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::TMAReduxKind" << " to be one of: " << "add" << ", " << "max" << ", " << "min" << ", " << "inc" << ", " << "dec" << ", " << "and" << ", " << "or" << ", " << "xor")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse TMAReduxKindAttr parameter 'value' which is to be a `::mlir::NVVM::TMAReduxKind`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return TMAReduxKindAttr::get(odsParser.getContext(),
      ::mlir::NVVM::TMAReduxKind((*_result_value)));
}

void TMAReduxKindAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyTMAReduxKind(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::TMAReduxKind TMAReduxKindAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::TMAReduxKindAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct WGMMAScaleInAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::WGMMAScaleIn>;
  WGMMAScaleInAttrStorage(::mlir::NVVM::WGMMAScaleIn value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static WGMMAScaleInAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<WGMMAScaleInAttrStorage>()) WGMMAScaleInAttrStorage(std::move(value));
  }

  ::mlir::NVVM::WGMMAScaleIn value;
};
} // namespace detail
WGMMAScaleInAttr WGMMAScaleInAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::WGMMAScaleIn value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute WGMMAScaleInAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::WGMMAScaleIn> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::WGMMAScaleIn> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeWGMMAScaleIn(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::WGMMAScaleIn" << " to be one of: " << "one" << ", " << "neg")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse WGMMAScaleInAttr parameter 'value' which is to be a `::mlir::NVVM::WGMMAScaleIn`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return WGMMAScaleInAttr::get(odsParser.getContext(),
      ::mlir::NVVM::WGMMAScaleIn((*_result_value)));
}

void WGMMAScaleInAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyWGMMAScaleIn(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::WGMMAScaleIn WGMMAScaleInAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::WGMMAScaleInAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct WGMMAScaleOutAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::WGMMAScaleOut>;
  WGMMAScaleOutAttrStorage(::mlir::NVVM::WGMMAScaleOut value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static WGMMAScaleOutAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<WGMMAScaleOutAttrStorage>()) WGMMAScaleOutAttrStorage(std::move(value));
  }

  ::mlir::NVVM::WGMMAScaleOut value;
};
} // namespace detail
WGMMAScaleOutAttr WGMMAScaleOutAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::WGMMAScaleOut value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute WGMMAScaleOutAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::WGMMAScaleOut> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::WGMMAScaleOut> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeWGMMAScaleOut(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::WGMMAScaleOut" << " to be one of: " << "zero" << ", " << "one")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse WGMMAScaleOutAttr parameter 'value' which is to be a `::mlir::NVVM::WGMMAScaleOut`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return WGMMAScaleOutAttr::get(odsParser.getContext(),
      ::mlir::NVVM::WGMMAScaleOut((*_result_value)));
}

void WGMMAScaleOutAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyWGMMAScaleOut(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::WGMMAScaleOut WGMMAScaleOutAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::WGMMAScaleOutAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct WGMMATypesAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::WGMMATypes>;
  WGMMATypesAttrStorage(::mlir::NVVM::WGMMATypes value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static WGMMATypesAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<WGMMATypesAttrStorage>()) WGMMATypesAttrStorage(std::move(value));
  }

  ::mlir::NVVM::WGMMATypes value;
};
} // namespace detail
WGMMATypesAttr WGMMATypesAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::WGMMATypes value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute WGMMATypesAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::WGMMATypes> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::WGMMATypes> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeWGMMATypes(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::WGMMATypes" << " to be one of: " << "f16" << ", " << "tf32" << ", " << "u8" << ", " << "s8" << ", " << "b1" << ", " << "bf16" << ", " << "e4m3" << ", " << "e5m2" << ", " << "f32" << ", " << "s32")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse WGMMATypesAttr parameter 'value' which is to be a `::mlir::NVVM::WGMMATypes`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return WGMMATypesAttr::get(odsParser.getContext(),
      ::mlir::NVVM::WGMMATypes((*_result_value)));
}

void WGMMATypesAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyWGMMATypes(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::WGMMATypes WGMMATypesAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::WGMMATypesAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct MatchSyncKindAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::MatchSyncKind>;
  MatchSyncKindAttrStorage(::mlir::NVVM::MatchSyncKind value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static MatchSyncKindAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<MatchSyncKindAttrStorage>()) MatchSyncKindAttrStorage(std::move(value));
  }

  ::mlir::NVVM::MatchSyncKind value;
};
} // namespace detail
MatchSyncKindAttr MatchSyncKindAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::MatchSyncKind value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute MatchSyncKindAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::MatchSyncKind> _result_value;

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::MatchSyncKind> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeMatchSyncKind(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::MatchSyncKind" << " to be one of: " << "any" << ", " << "all")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse MatchSyncKindAttr parameter 'value' which is to be a `::mlir::NVVM::MatchSyncKind`");
    return {};
  }
  assert(::mlir::succeeded(_result_value));
  return MatchSyncKindAttr::get(odsParser.getContext(),
      ::mlir::NVVM::MatchSyncKind((*_result_value)));
}

void MatchSyncKindAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << ' ';
  odsPrinter << stringifyMatchSyncKind(getValue());
}

::mlir::NVVM::MatchSyncKind MatchSyncKindAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::MatchSyncKindAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct Tcgen05GroupKindAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::Tcgen05GroupKind>;
  Tcgen05GroupKindAttrStorage(::mlir::NVVM::Tcgen05GroupKind value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static Tcgen05GroupKindAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<Tcgen05GroupKindAttrStorage>()) Tcgen05GroupKindAttrStorage(std::move(value));
  }

  ::mlir::NVVM::Tcgen05GroupKind value;
};
} // namespace detail
Tcgen05GroupKindAttr Tcgen05GroupKindAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::Tcgen05GroupKind value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute Tcgen05GroupKindAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::Tcgen05GroupKind> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::Tcgen05GroupKind> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeTcgen05GroupKind(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::Tcgen05GroupKind" << " to be one of: " << "cta_1" << ", " << "cta_2")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse Tcgen05GroupKindAttr parameter 'value' which is to be a `::mlir::NVVM::Tcgen05GroupKind`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return Tcgen05GroupKindAttr::get(odsParser.getContext(),
      ::mlir::NVVM::Tcgen05GroupKind((*_result_value)));
}

void Tcgen05GroupKindAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyTcgen05GroupKind(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::Tcgen05GroupKind Tcgen05GroupKindAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::Tcgen05GroupKindAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct Tcgen05FenceKindAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::Tcgen05FenceKind>;
  Tcgen05FenceKindAttrStorage(::mlir::NVVM::Tcgen05FenceKind value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static Tcgen05FenceKindAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<Tcgen05FenceKindAttrStorage>()) Tcgen05FenceKindAttrStorage(std::move(value));
  }

  ::mlir::NVVM::Tcgen05FenceKind value;
};
} // namespace detail
Tcgen05FenceKindAttr Tcgen05FenceKindAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::Tcgen05FenceKind value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute Tcgen05FenceKindAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::Tcgen05FenceKind> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::Tcgen05FenceKind> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeTcgen05FenceKind(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::Tcgen05FenceKind" << " to be one of: " << "before" << ", " << "after")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse Tcgen05FenceKindAttr parameter 'value' which is to be a `::mlir::NVVM::Tcgen05FenceKind`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return Tcgen05FenceKindAttr::get(odsParser.getContext(),
      ::mlir::NVVM::Tcgen05FenceKind((*_result_value)));
}

void Tcgen05FenceKindAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyTcgen05FenceKind(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::Tcgen05FenceKind Tcgen05FenceKindAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::Tcgen05FenceKindAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct Tcgen05WaitKindAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::Tcgen05WaitKind>;
  Tcgen05WaitKindAttrStorage(::mlir::NVVM::Tcgen05WaitKind value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static Tcgen05WaitKindAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<Tcgen05WaitKindAttrStorage>()) Tcgen05WaitKindAttrStorage(std::move(value));
  }

  ::mlir::NVVM::Tcgen05WaitKind value;
};
} // namespace detail
Tcgen05WaitKindAttr Tcgen05WaitKindAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::Tcgen05WaitKind value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute Tcgen05WaitKindAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::Tcgen05WaitKind> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::Tcgen05WaitKind> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeTcgen05WaitKind(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::Tcgen05WaitKind" << " to be one of: " << "load" << ", " << "store")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse Tcgen05WaitKindAttr parameter 'value' which is to be a `::mlir::NVVM::Tcgen05WaitKind`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return Tcgen05WaitKindAttr::get(odsParser.getContext(),
      ::mlir::NVVM::Tcgen05WaitKind((*_result_value)));
}

void Tcgen05WaitKindAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyTcgen05WaitKind(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::Tcgen05WaitKind Tcgen05WaitKindAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::Tcgen05WaitKindAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct Tcgen05CpShapeAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::Tcgen05CpShape>;
  Tcgen05CpShapeAttrStorage(::mlir::NVVM::Tcgen05CpShape value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static Tcgen05CpShapeAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<Tcgen05CpShapeAttrStorage>()) Tcgen05CpShapeAttrStorage(std::move(value));
  }

  ::mlir::NVVM::Tcgen05CpShape value;
};
} // namespace detail
Tcgen05CpShapeAttr Tcgen05CpShapeAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::Tcgen05CpShape value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute Tcgen05CpShapeAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::Tcgen05CpShape> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::Tcgen05CpShape> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeTcgen05CpShape(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::Tcgen05CpShape" << " to be one of: " << "shape_128x256b" << ", " << "shape_4x256b" << ", " << "shape_128x128b" << ", " << "shape_64x128b" << ", " << "shape_32x128b")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse Tcgen05CpShapeAttr parameter 'value' which is to be a `::mlir::NVVM::Tcgen05CpShape`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return Tcgen05CpShapeAttr::get(odsParser.getContext(),
      ::mlir::NVVM::Tcgen05CpShape((*_result_value)));
}

void Tcgen05CpShapeAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyTcgen05CpShape(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::Tcgen05CpShape Tcgen05CpShapeAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::Tcgen05CpShapeAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct Tcgen05CpMulticastAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::Tcgen05CpMulticast>;
  Tcgen05CpMulticastAttrStorage(::mlir::NVVM::Tcgen05CpMulticast value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static Tcgen05CpMulticastAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<Tcgen05CpMulticastAttrStorage>()) Tcgen05CpMulticastAttrStorage(std::move(value));
  }

  ::mlir::NVVM::Tcgen05CpMulticast value;
};
} // namespace detail
Tcgen05CpMulticastAttr Tcgen05CpMulticastAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::Tcgen05CpMulticast value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute Tcgen05CpMulticastAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::Tcgen05CpMulticast> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::Tcgen05CpMulticast> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeTcgen05CpMulticast(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::Tcgen05CpMulticast" << " to be one of: " << "none" << ", " << "warpx2_02_13" << ", " << "warpx2_01_23" << ", " << "warpx4")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse Tcgen05CpMulticastAttr parameter 'value' which is to be a `::mlir::NVVM::Tcgen05CpMulticast`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return Tcgen05CpMulticastAttr::get(odsParser.getContext(),
      ::mlir::NVVM::Tcgen05CpMulticast((*_result_value)));
}

void Tcgen05CpMulticastAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyTcgen05CpMulticast(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::Tcgen05CpMulticast Tcgen05CpMulticastAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::Tcgen05CpMulticastAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct Tcgen05CpSrcFormatAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::Tcgen05CpSrcFormat>;
  Tcgen05CpSrcFormatAttrStorage(::mlir::NVVM::Tcgen05CpSrcFormat value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static Tcgen05CpSrcFormatAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<Tcgen05CpSrcFormatAttrStorage>()) Tcgen05CpSrcFormatAttrStorage(std::move(value));
  }

  ::mlir::NVVM::Tcgen05CpSrcFormat value;
};
} // namespace detail
Tcgen05CpSrcFormatAttr Tcgen05CpSrcFormatAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::Tcgen05CpSrcFormat value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute Tcgen05CpSrcFormatAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::Tcgen05CpSrcFormat> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::Tcgen05CpSrcFormat> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeTcgen05CpSrcFormat(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::Tcgen05CpSrcFormat" << " to be one of: " << "b6x16_p32" << ", " << "b4x16_p64")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse Tcgen05CpSrcFormatAttr parameter 'value' which is to be a `::mlir::NVVM::Tcgen05CpSrcFormat`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return Tcgen05CpSrcFormatAttr::get(odsParser.getContext(),
      ::mlir::NVVM::Tcgen05CpSrcFormat((*_result_value)));
}

void Tcgen05CpSrcFormatAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyTcgen05CpSrcFormat(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::Tcgen05CpSrcFormat Tcgen05CpSrcFormatAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::Tcgen05CpSrcFormatAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct Tcgen05LdStShapeAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::Tcgen05LdStShape>;
  Tcgen05LdStShapeAttrStorage(::mlir::NVVM::Tcgen05LdStShape value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static Tcgen05LdStShapeAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<Tcgen05LdStShapeAttrStorage>()) Tcgen05LdStShapeAttrStorage(std::move(value));
  }

  ::mlir::NVVM::Tcgen05LdStShape value;
};
} // namespace detail
Tcgen05LdStShapeAttr Tcgen05LdStShapeAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::Tcgen05LdStShape value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute Tcgen05LdStShapeAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::Tcgen05LdStShape> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::Tcgen05LdStShape> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeTcgen05LdStShape(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::Tcgen05LdStShape" << " to be one of: " << "shape_16x64b" << ", " << "shape_16x128b" << ", " << "shape_16x256b" << ", " << "shape_32x32b" << ", " << "shape_16x32bx2")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse Tcgen05LdStShapeAttr parameter 'value' which is to be a `::mlir::NVVM::Tcgen05LdStShape`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return Tcgen05LdStShapeAttr::get(odsParser.getContext(),
      ::mlir::NVVM::Tcgen05LdStShape((*_result_value)));
}

void Tcgen05LdStShapeAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyTcgen05LdStShape(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::Tcgen05LdStShape Tcgen05LdStShapeAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::Tcgen05LdStShapeAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct DotAccumulateTypeAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<::mlir::NVVM::DotAccumulateType>;
  DotAccumulateTypeAttrStorage(::mlir::NVVM::DotAccumulateType value) : value(std::move(value)) {}

  KeyTy getAsKey() const {
    return KeyTy(value);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (value == std::get<0>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey));
  }

  static DotAccumulateTypeAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto value = std::move(std::get<0>(tblgenKey));
    return new (allocator.allocate<DotAccumulateTypeAttrStorage>()) DotAccumulateTypeAttrStorage(std::move(value));
  }

  ::mlir::NVVM::DotAccumulateType value;
};
} // namespace detail
DotAccumulateTypeAttr DotAccumulateTypeAttr::get(::mlir::MLIRContext *context, ::mlir::NVVM::DotAccumulateType value) {
  return Base::get(context, std::move(value));
}

::mlir::Attribute DotAccumulateTypeAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<::mlir::NVVM::DotAccumulateType> _result_value;
  // Parse literal '<'
  if (odsParser.parseLess()) return {};

  // Parse variable 'value'
  _result_value = [&]() -> ::mlir::FailureOr<::mlir::NVVM::DotAccumulateType> {
      auto loc = odsParser.getCurrentLocation();
      ::llvm::StringRef enumKeyword;
      if (::mlir::failed(odsParser.parseKeyword(&enumKeyword)))
        return ::mlir::failure();
      auto maybeEnum = ::mlir::NVVM::symbolizeDotAccumulateType(enumKeyword);
      if (maybeEnum)
        return *maybeEnum;
      return {(::llvm::LogicalResult)(odsParser.emitError(loc) << "expected " << "::mlir::NVVM::DotAccumulateType" << " to be one of: " << "signed" << ", " << "unsigned")};
    }();
  if (::mlir::failed(_result_value)) {
    odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse DotAccumulateTypeAttr parameter 'value' which is to be a `::mlir::NVVM::DotAccumulateType`");
    return {};
  }
  // Parse literal '>'
  if (odsParser.parseGreater()) return {};
  assert(::mlir::succeeded(_result_value));
  return DotAccumulateTypeAttr::get(odsParser.getContext(),
      ::mlir::NVVM::DotAccumulateType((*_result_value)));
}

void DotAccumulateTypeAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  odsPrinter << "<";
  odsPrinter << stringifyDotAccumulateType(getValue());
  odsPrinter << ">";
}

::mlir::NVVM::DotAccumulateType DotAccumulateTypeAttr::getValue() const {
  return getImpl()->value;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::DotAccumulateTypeAttr)
namespace mlir {
namespace NVVM {
namespace detail {
struct NVVMTargetAttrStorage : public ::mlir::AttributeStorage {
  using KeyTy = std::tuple<int, ::llvm::StringRef, ::llvm::StringRef, ::llvm::StringRef, DictionaryAttr, ArrayAttr, bool>;
  NVVMTargetAttrStorage(int O, ::llvm::StringRef triple, ::llvm::StringRef chip, ::llvm::StringRef features, DictionaryAttr flags, ArrayAttr link, bool verifyTarget) : O(std::move(O)), triple(std::move(triple)), chip(std::move(chip)), features(std::move(features)), flags(std::move(flags)), link(std::move(link)), verifyTarget(std::move(verifyTarget)) {}

  KeyTy getAsKey() const {
    return KeyTy(O, triple, chip, features, flags, link, verifyTarget);
  }

  bool operator==(const KeyTy &tblgenKey) const {
    return (O == std::get<0>(tblgenKey)) && (triple == std::get<1>(tblgenKey)) && (chip == std::get<2>(tblgenKey)) && (features == std::get<3>(tblgenKey)) && (flags == std::get<4>(tblgenKey)) && (link == std::get<5>(tblgenKey)) && (verifyTarget == std::get<6>(tblgenKey));
  }

  static ::llvm::hash_code hashKey(const KeyTy &tblgenKey) {
    return ::llvm::hash_combine(std::get<0>(tblgenKey), std::get<1>(tblgenKey), std::get<2>(tblgenKey), std::get<3>(tblgenKey), std::get<4>(tblgenKey), std::get<5>(tblgenKey), std::get<6>(tblgenKey));
  }

  static NVVMTargetAttrStorage *construct(::mlir::AttributeStorageAllocator &allocator, KeyTy &&tblgenKey) {
    auto O = std::move(std::get<0>(tblgenKey));
    auto triple = std::move(std::get<1>(tblgenKey));
    auto chip = std::move(std::get<2>(tblgenKey));
    auto features = std::move(std::get<3>(tblgenKey));
    auto flags = std::move(std::get<4>(tblgenKey));
    auto link = std::move(std::get<5>(tblgenKey));
    auto verifyTarget = std::move(std::get<6>(tblgenKey));
    triple = allocator.copyInto(triple);
    chip = allocator.copyInto(chip);
    features = allocator.copyInto(features);
    return new (allocator.allocate<NVVMTargetAttrStorage>()) NVVMTargetAttrStorage(std::move(O), std::move(triple), std::move(chip), std::move(features), std::move(flags), std::move(link), std::move(verifyTarget));
  }

  int O;
  ::llvm::StringRef triple;
  ::llvm::StringRef chip;
  ::llvm::StringRef features;
  DictionaryAttr flags;
  ArrayAttr link;
  bool verifyTarget;
};
} // namespace detail
bool NVVMTargetAttr::hasFlag(StringRef flag) const {
  if (DictionaryAttr flags = getFlags())
    return flags.get(flag) != nullptr;
  return false;
}
bool NVVMTargetAttr::hasFastMath() const {
  return hasFlag("fast");
}
bool NVVMTargetAttr::hasFtz() const {
  return hasFlag("ftz");
}
bool NVVMTargetAttr::hasCmdOptions() const {
  return hasFlag("ptxas-cmd-options");
}
std::optional<mlir::NamedAttribute> NVVMTargetAttr::getCmdOptions() const {
  return getFlags().getNamed("ptxas-cmd-options");
}
NVVMTargetAttr NVVMTargetAttr::get(::mlir::MLIRContext *context, int optLevel, StringRef triple, StringRef chip, StringRef features, DictionaryAttr targetFlags, ArrayAttr linkFiles, bool verifyTarget) {
  return Base::get(context, optLevel, triple, chip, features, targetFlags, linkFiles, verifyTarget);
}

NVVMTargetAttr NVVMTargetAttr::getChecked(::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError, ::mlir::MLIRContext *context, int optLevel, StringRef triple, StringRef chip, StringRef features, DictionaryAttr targetFlags, ArrayAttr linkFiles, bool verifyTarget) {
  return Base::get(context, optLevel, triple, chip, features, targetFlags, linkFiles, verifyTarget);
}

::llvm::LogicalResult NVVMTargetAttr::verifyInvariants(::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError, int O, ::llvm::StringRef triple, ::llvm::StringRef chip, ::llvm::StringRef features, DictionaryAttr flags, ArrayAttr link, bool verifyTarget) {
  if (::mlir::failed(verify(emitError, O, triple, chip, features, flags, link, verifyTarget)))
    return ::mlir::failure();
  return ::mlir::success();
}

::mlir::Attribute NVVMTargetAttr::parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType) {
  ::mlir::Builder odsBuilder(odsParser.getContext());
  ::llvm::SMLoc odsLoc = odsParser.getCurrentLocation();
  (void) odsLoc;
  ::mlir::FailureOr<int> _result_O;
  ::mlir::FailureOr<std::string> _result_triple;
  ::mlir::FailureOr<std::string> _result_chip;
  ::mlir::FailureOr<std::string> _result_features;
  ::mlir::FailureOr<DictionaryAttr> _result_flags;
  ::mlir::FailureOr<ArrayAttr> _result_link;
  ::mlir::FailureOr<bool> _result_verifyTarget;
  // Parse literal '<'
  if (odsParser.parseOptionalLess()) {
  } else {
    // Parse parameter struct
    bool _seen_O = false;
    bool _seen_triple = false;
    bool _seen_chip = false;
    bool _seen_features = false;
    bool _seen_flags = false;
    bool _seen_link = false;
    bool _seen_verifyTarget = false;
    {
      const auto _loop_body = [&](::llvm::StringRef _paramKey) -> bool {
        // Parse literal '='
        if (odsParser.parseEqual()) return {};
        if (!_seen_O && _paramKey == "O") {
          _seen_O = true;

          // Parse variable 'O'
          _result_O = ::mlir::FieldParser<int>::parse(odsParser);
          if (::mlir::failed(_result_O)) {
            odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse NVVM_TargetAttr parameter 'O' which is to be a `int`");
            return {};
          }
        } else if (!_seen_triple && _paramKey == "triple") {
          _seen_triple = true;

          // Parse variable 'triple'
          _result_triple = ::mlir::FieldParser<std::string>::parse(odsParser);
          if (::mlir::failed(_result_triple)) {
            odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse NVVM_TargetAttr parameter 'triple' which is to be a `::llvm::StringRef`");
            return {};
          }
        } else if (!_seen_chip && _paramKey == "chip") {
          _seen_chip = true;

          // Parse variable 'chip'
          _result_chip = ::mlir::FieldParser<std::string>::parse(odsParser);
          if (::mlir::failed(_result_chip)) {
            odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse NVVM_TargetAttr parameter 'chip' which is to be a `::llvm::StringRef`");
            return {};
          }
        } else if (!_seen_features && _paramKey == "features") {
          _seen_features = true;

          // Parse variable 'features'
          _result_features = ::mlir::FieldParser<std::string>::parse(odsParser);
          if (::mlir::failed(_result_features)) {
            odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse NVVM_TargetAttr parameter 'features' which is to be a `::llvm::StringRef`");
            return {};
          }
        } else if (!_seen_flags && _paramKey == "flags") {
          _seen_flags = true;

          // Parse variable 'flags'
          _result_flags = ::mlir::FieldParser<DictionaryAttr>::parse(odsParser);
          if (::mlir::failed(_result_flags)) {
            odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse NVVM_TargetAttr parameter 'flags' which is to be a `DictionaryAttr`");
            return {};
          }
        } else if (!_seen_link && _paramKey == "link") {
          _seen_link = true;

          // Parse variable 'link'
          _result_link = ::mlir::FieldParser<ArrayAttr>::parse(odsParser);
          if (::mlir::failed(_result_link)) {
            odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse NVVM_TargetAttr parameter 'link' which is to be a `ArrayAttr`");
            return {};
          }
        } else if (!_seen_verifyTarget && _paramKey == "verifyTarget") {
          _seen_verifyTarget = true;

          // Parse variable 'verifyTarget'
          _result_verifyTarget = ::mlir::FieldParser<bool>::parse(odsParser);
          if (::mlir::failed(_result_verifyTarget)) {
            odsParser.emitError(odsParser.getCurrentLocation(), "failed to parse NVVM_TargetAttr parameter 'verifyTarget' which is to be a `bool`");
            return {};
          }
        } else {
          odsParser.emitError(odsParser.getCurrentLocation(), "duplicate or unknown struct parameter name: ") << _paramKey;
          return {};
        }
        return true;
      };
      ::llvm::StringRef _paramKey;
      if (!odsParser.parseOptionalKeyword(&_paramKey)) {
        if (!_loop_body(_paramKey)) return {};
        while (!odsParser.parseOptionalComma()) {
          ::llvm::StringRef _paramKey;
          if (odsParser.parseKeyword(&_paramKey)) {
            odsParser.emitError(odsParser.getCurrentLocation(),
                               "expected a parameter name in struct");
            return {};
          }
          if (!_loop_body(_paramKey)) return {};
        }
      }
    }
    // Parse literal '>'
    if (odsParser.parseGreater()) return {};
  }
  return odsParser.getChecked<NVVMTargetAttr>(odsLoc, odsParser.getContext(),
      int((_result_O.value_or(2))),
      ::llvm::StringRef((_result_triple.value_or("nvptx64-nvidia-cuda"))),
      ::llvm::StringRef((_result_chip.value_or("sm_50"))),
      ::llvm::StringRef((_result_features.value_or("+ptx60"))),
      DictionaryAttr((_result_flags.value_or(DictionaryAttr()))),
      ArrayAttr((_result_link.value_or(ArrayAttr()))),
      bool((_result_verifyTarget.value_or(true))));
}

void NVVMTargetAttr::print(::mlir::AsmPrinter &odsPrinter) const {
  ::mlir::Builder odsBuilder(getContext());
  if (!(getO() == 2) || !(getTriple() == "nvptx64-nvidia-cuda") || !(getChip() == "sm_50") || !(getFeatures() == "+ptx60") || !(getFlags() == DictionaryAttr()) || !(getLink() == ArrayAttr()) || !(getVerifyTarget() == true)) {
    odsPrinter << "<";
    {
      bool _firstPrinted = true;
      if (!(getO() == 2)) {
        if (!_firstPrinted) odsPrinter << ", ";
        _firstPrinted = false;
        odsPrinter << "O = ";
        if (!(getO() == 2)) {
          odsPrinter.printStrippedAttrOrType(getO());
        }
      }
      if (!(getTriple() == "nvptx64-nvidia-cuda")) {
        if (!_firstPrinted) odsPrinter << ", ";
        _firstPrinted = false;
        odsPrinter << "triple = ";
        if (!(getTriple() == "nvptx64-nvidia-cuda")) {
          odsPrinter.printString(getTriple());;
        }
      }
      if (!(getChip() == "sm_50")) {
        if (!_firstPrinted) odsPrinter << ", ";
        _firstPrinted = false;
        odsPrinter << "chip = ";
        if (!(getChip() == "sm_50")) {
          odsPrinter.printString(getChip());;
        }
      }
      if (!(getFeatures() == "+ptx60")) {
        if (!_firstPrinted) odsPrinter << ", ";
        _firstPrinted = false;
        odsPrinter << "features = ";
        if (!(getFeatures() == "+ptx60")) {
          odsPrinter.printString(getFeatures());;
        }
      }
      if (!(getFlags() == DictionaryAttr())) {
        if (!_firstPrinted) odsPrinter << ", ";
        _firstPrinted = false;
        odsPrinter << "flags = ";
        if (!(getFlags() == DictionaryAttr())) {
          odsPrinter.printStrippedAttrOrType(getFlags());
        }
      }
      if (!(getLink() == ArrayAttr())) {
        if (!_firstPrinted) odsPrinter << ", ";
        _firstPrinted = false;
        odsPrinter << "link = ";
        if (!(getLink() == ArrayAttr())) {
          odsPrinter.printStrippedAttrOrType(getLink());
        }
      }
      if (!(getVerifyTarget() == true)) {
        if (!_firstPrinted) odsPrinter << ", ";
        _firstPrinted = false;
        odsPrinter << "verifyTarget = ";
        if (!(getVerifyTarget() == true)) {
          odsPrinter.printStrippedAttrOrType(getVerifyTarget());
        }
      }
    }
    odsPrinter << ">";
  } else {
  }
}

int NVVMTargetAttr::getO() const {
  return getImpl()->O;
}

::llvm::StringRef NVVMTargetAttr::getTriple() const {
  return getImpl()->triple;
}

::llvm::StringRef NVVMTargetAttr::getChip() const {
  return getImpl()->chip;
}

::llvm::StringRef NVVMTargetAttr::getFeatures() const {
  return getImpl()->features;
}

DictionaryAttr NVVMTargetAttr::getFlags() const {
  return getImpl()->flags;
}

ArrayAttr NVVMTargetAttr::getLink() const {
  return getImpl()->link;
}

bool NVVMTargetAttr::getVerifyTarget() const {
  return getImpl()->verifyTarget;
}

} // namespace NVVM
} // namespace mlir
MLIR_DEFINE_EXPLICIT_TYPE_ID(::mlir::NVVM::NVVMTargetAttr)
namespace mlir {
namespace NVVM {

/// Parse an attribute registered to this dialect.
::mlir::Attribute NVVMDialect::parseAttribute(::mlir::DialectAsmParser &parser,
                                      ::mlir::Type type) const {
  ::llvm::SMLoc typeLoc = parser.getCurrentLocation();
  ::llvm::StringRef attrTag;
  {
    ::mlir::Attribute attr;
    auto parseResult = generatedAttributeParser(parser, &attrTag, type, attr);
    if (parseResult.has_value())
      return attr;
  }
  
  parser.emitError(typeLoc) << "unknown attribute `"
      << attrTag << "` in dialect `" << getNamespace() << "`";
  return {};
}
/// Print an attribute registered to this dialect.
void NVVMDialect::printAttribute(::mlir::Attribute attr,
                         ::mlir::DialectAsmPrinter &printer) const {
  if (::mlir::succeeded(generatedAttributePrinter(attr, printer)))
    return;
  
}
} // namespace NVVM
} // namespace mlir

#endif  // GET_ATTRDEF_CLASSES

