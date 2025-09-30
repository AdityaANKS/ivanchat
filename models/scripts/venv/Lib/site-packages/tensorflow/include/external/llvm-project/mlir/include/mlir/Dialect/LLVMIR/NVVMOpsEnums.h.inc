/*===- TableGen'erated file -------------------------------------*- C++ -*-===*\
|*                                                                            *|
|* Enum Utility Declarations                                                  *|
|*                                                                            *|
|* Automatically generated file, do not edit!                                 *|
|* From: NVVMOps.td                                                           *|
|*                                                                            *|
\*===----------------------------------------------------------------------===*/

namespace mlir {
namespace NVVM {
// NVVM Cache Eviction Priority
enum class CacheEvictionPriority : uint32_t {
  EvictNormal = 0,
  EvictFirst = 1,
  EvictLast = 2,
  EvictUnchanged = 3,
  NoAllocate = 4,
};

::std::optional<CacheEvictionPriority> symbolizeCacheEvictionPriority(uint32_t);
::llvm::StringRef stringifyCacheEvictionPriority(CacheEvictionPriority);
::std::optional<CacheEvictionPriority> symbolizeCacheEvictionPriority(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForCacheEvictionPriority() {
  return 4;
}


inline ::llvm::StringRef stringifyEnum(CacheEvictionPriority enumValue) {
  return stringifyCacheEvictionPriority(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<CacheEvictionPriority> symbolizeEnum<CacheEvictionPriority>(::llvm::StringRef str) {
  return symbolizeCacheEvictionPriority(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::CacheEvictionPriority, ::mlir::NVVM::CacheEvictionPriority> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::CacheEvictionPriority> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM Cache Eviction Priority");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::CacheEvictionPriority> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::CacheEvictionPriority>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [evict_normal, evict_first, evict_last, evict_unchanged, no_allocate] for NVVM Cache Eviction Priority, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::CacheEvictionPriority>, std::optional<::mlir::NVVM::CacheEvictionPriority>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::CacheEvictionPriority>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::CacheEvictionPriority>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::CacheEvictionPriority> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::CacheEvictionPriority>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [evict_normal, evict_first, evict_last, evict_unchanged, no_allocate] for NVVM Cache Eviction Priority, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::CacheEvictionPriority value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::CacheEvictionPriority> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::CacheEvictionPriority getEmptyKey() {
    return static_cast<::mlir::NVVM::CacheEvictionPriority>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::CacheEvictionPriority getTombstoneKey() {
    return static_cast<::mlir::NVVM::CacheEvictionPriority>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::CacheEvictionPriority &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::CacheEvictionPriority &lhs, const ::mlir::NVVM::CacheEvictionPriority &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM ConvertFP6Type kind
enum class ConvertFP6Type : uint32_t {
  E2M3 = 0,
  E3M2 = 1,
};

::std::optional<ConvertFP6Type> symbolizeConvertFP6Type(uint32_t);
::llvm::StringRef stringifyConvertFP6Type(ConvertFP6Type);
::std::optional<ConvertFP6Type> symbolizeConvertFP6Type(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForConvertFP6Type() {
  return 1;
}


inline ::llvm::StringRef stringifyEnum(ConvertFP6Type enumValue) {
  return stringifyConvertFP6Type(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<ConvertFP6Type> symbolizeEnum<ConvertFP6Type>(::llvm::StringRef str) {
  return symbolizeConvertFP6Type(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::ConvertFP6Type, ::mlir::NVVM::ConvertFP6Type> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::ConvertFP6Type> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM ConvertFP6Type kind");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::ConvertFP6Type> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::ConvertFP6Type>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [e2m3, e3m2] for NVVM ConvertFP6Type kind, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::ConvertFP6Type>, std::optional<::mlir::NVVM::ConvertFP6Type>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::ConvertFP6Type>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::ConvertFP6Type>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::ConvertFP6Type> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::ConvertFP6Type>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [e2m3, e3m2] for NVVM ConvertFP6Type kind, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::ConvertFP6Type value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::ConvertFP6Type> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::ConvertFP6Type getEmptyKey() {
    return static_cast<::mlir::NVVM::ConvertFP6Type>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::ConvertFP6Type getTombstoneKey() {
    return static_cast<::mlir::NVVM::ConvertFP6Type>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::ConvertFP6Type &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::ConvertFP6Type &lhs, const ::mlir::NVVM::ConvertFP6Type &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM ConvertFP8Type kind
enum class ConvertFP8Type : uint32_t {
  E4M3 = 0,
  E5M2 = 1,
  UE8M0 = 2,
};

::std::optional<ConvertFP8Type> symbolizeConvertFP8Type(uint32_t);
::llvm::StringRef stringifyConvertFP8Type(ConvertFP8Type);
::std::optional<ConvertFP8Type> symbolizeConvertFP8Type(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForConvertFP8Type() {
  return 2;
}


inline ::llvm::StringRef stringifyEnum(ConvertFP8Type enumValue) {
  return stringifyConvertFP8Type(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<ConvertFP8Type> symbolizeEnum<ConvertFP8Type>(::llvm::StringRef str) {
  return symbolizeConvertFP8Type(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::ConvertFP8Type, ::mlir::NVVM::ConvertFP8Type> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::ConvertFP8Type> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM ConvertFP8Type kind");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::ConvertFP8Type> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::ConvertFP8Type>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [e4m3, e5m2, ue8m0] for NVVM ConvertFP8Type kind, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::ConvertFP8Type>, std::optional<::mlir::NVVM::ConvertFP8Type>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::ConvertFP8Type>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::ConvertFP8Type>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::ConvertFP8Type> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::ConvertFP8Type>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [e4m3, e5m2, ue8m0] for NVVM ConvertFP8Type kind, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::ConvertFP8Type value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::ConvertFP8Type> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::ConvertFP8Type getEmptyKey() {
    return static_cast<::mlir::NVVM::ConvertFP8Type>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::ConvertFP8Type getTombstoneKey() {
    return static_cast<::mlir::NVVM::ConvertFP8Type>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::ConvertFP8Type &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::ConvertFP8Type &lhs, const ::mlir::NVVM::ConvertFP8Type &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM DotAccumulateType
enum class DotAccumulateType : uint32_t {
  SIGNED = 1,
  UNSIGNED = 0,
};

::std::optional<DotAccumulateType> symbolizeDotAccumulateType(uint32_t);
::llvm::StringRef stringifyDotAccumulateType(DotAccumulateType);
::std::optional<DotAccumulateType> symbolizeDotAccumulateType(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForDotAccumulateType() {
  return 1;
}


inline ::llvm::StringRef stringifyEnum(DotAccumulateType enumValue) {
  return stringifyDotAccumulateType(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<DotAccumulateType> symbolizeEnum<DotAccumulateType>(::llvm::StringRef str) {
  return symbolizeDotAccumulateType(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::DotAccumulateType, ::mlir::NVVM::DotAccumulateType> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::DotAccumulateType> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM DotAccumulateType");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::DotAccumulateType> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::DotAccumulateType>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [signed, unsigned] for NVVM DotAccumulateType, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::DotAccumulateType>, std::optional<::mlir::NVVM::DotAccumulateType>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::DotAccumulateType>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::DotAccumulateType>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::DotAccumulateType> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::DotAccumulateType>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [signed, unsigned] for NVVM DotAccumulateType, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::DotAccumulateType value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::DotAccumulateType> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::DotAccumulateType getEmptyKey() {
    return static_cast<::mlir::NVVM::DotAccumulateType>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::DotAccumulateType getTombstoneKey() {
    return static_cast<::mlir::NVVM::DotAccumulateType>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::DotAccumulateType &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::DotAccumulateType &lhs, const ::mlir::NVVM::DotAccumulateType &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM FPRoundingMode kind
enum class FPRoundingMode : uint32_t {
  NONE = 0,
  RN = 1,
  RM = 2,
  RP = 3,
  RZ = 4,
  RNA = 5,
};

::std::optional<FPRoundingMode> symbolizeFPRoundingMode(uint32_t);
::llvm::StringRef stringifyFPRoundingMode(FPRoundingMode);
::std::optional<FPRoundingMode> symbolizeFPRoundingMode(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForFPRoundingMode() {
  return 5;
}


inline ::llvm::StringRef stringifyEnum(FPRoundingMode enumValue) {
  return stringifyFPRoundingMode(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<FPRoundingMode> symbolizeEnum<FPRoundingMode>(::llvm::StringRef str) {
  return symbolizeFPRoundingMode(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::FPRoundingMode, ::mlir::NVVM::FPRoundingMode> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::FPRoundingMode> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM FPRoundingMode kind");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::FPRoundingMode> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::FPRoundingMode>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [none, rn, rm, rp, rz, rna] for NVVM FPRoundingMode kind, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::FPRoundingMode>, std::optional<::mlir::NVVM::FPRoundingMode>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::FPRoundingMode>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::FPRoundingMode>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::FPRoundingMode> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::FPRoundingMode>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [none, rn, rm, rp, rz, rna] for NVVM FPRoundingMode kind, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::FPRoundingMode value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::FPRoundingMode> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::FPRoundingMode getEmptyKey() {
    return static_cast<::mlir::NVVM::FPRoundingMode>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::FPRoundingMode getTombstoneKey() {
    return static_cast<::mlir::NVVM::FPRoundingMode>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::FPRoundingMode &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::FPRoundingMode &lhs, const ::mlir::NVVM::FPRoundingMode &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM load cache modifier kind
enum class LoadCacheModifierKind : uint32_t {
  CA = 0,
  CG = 1,
  CS = 2,
  LU = 3,
  CV = 4,
};

::std::optional<LoadCacheModifierKind> symbolizeLoadCacheModifierKind(uint32_t);
::llvm::StringRef stringifyLoadCacheModifierKind(LoadCacheModifierKind);
::std::optional<LoadCacheModifierKind> symbolizeLoadCacheModifierKind(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForLoadCacheModifierKind() {
  return 4;
}


inline ::llvm::StringRef stringifyEnum(LoadCacheModifierKind enumValue) {
  return stringifyLoadCacheModifierKind(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<LoadCacheModifierKind> symbolizeEnum<LoadCacheModifierKind>(::llvm::StringRef str) {
  return symbolizeLoadCacheModifierKind(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::LoadCacheModifierKind, ::mlir::NVVM::LoadCacheModifierKind> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::LoadCacheModifierKind> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM load cache modifier kind");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::LoadCacheModifierKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::LoadCacheModifierKind>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [ca, cg, cs, lu, cv] for NVVM load cache modifier kind, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::LoadCacheModifierKind>, std::optional<::mlir::NVVM::LoadCacheModifierKind>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::LoadCacheModifierKind>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::LoadCacheModifierKind>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::LoadCacheModifierKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::LoadCacheModifierKind>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [ca, cg, cs, lu, cv] for NVVM load cache modifier kind, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::LoadCacheModifierKind value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::LoadCacheModifierKind> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::LoadCacheModifierKind getEmptyKey() {
    return static_cast<::mlir::NVVM::LoadCacheModifierKind>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::LoadCacheModifierKind getTombstoneKey() {
    return static_cast<::mlir::NVVM::LoadCacheModifierKind>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::LoadCacheModifierKind &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::LoadCacheModifierKind &lhs, const ::mlir::NVVM::LoadCacheModifierKind &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// MMA binary operations
enum class MMAB1Op : uint32_t {
  none = 0,
  xor_popc = 1,
  and_popc = 2,
};

::std::optional<MMAB1Op> symbolizeMMAB1Op(uint32_t);
::llvm::StringRef stringifyMMAB1Op(MMAB1Op);
::std::optional<MMAB1Op> symbolizeMMAB1Op(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForMMAB1Op() {
  return 2;
}


inline ::llvm::StringRef stringifyEnum(MMAB1Op enumValue) {
  return stringifyMMAB1Op(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<MMAB1Op> symbolizeEnum<MMAB1Op>(::llvm::StringRef str) {
  return symbolizeMMAB1Op(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::MMAB1Op, ::mlir::NVVM::MMAB1Op> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::MMAB1Op> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for MMA binary operations");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::MMAB1Op> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::MMAB1Op>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [none, xor_popc, and_popc] for MMA binary operations, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::MMAB1Op>, std::optional<::mlir::NVVM::MMAB1Op>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::MMAB1Op>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::MMAB1Op>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::MMAB1Op> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::MMAB1Op>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [none, xor_popc, and_popc] for MMA binary operations, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::MMAB1Op value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::MMAB1Op> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::MMAB1Op getEmptyKey() {
    return static_cast<::mlir::NVVM::MMAB1Op>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::MMAB1Op getTombstoneKey() {
    return static_cast<::mlir::NVVM::MMAB1Op>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::MMAB1Op &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::MMAB1Op &lhs, const ::mlir::NVVM::MMAB1Op &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM MMA frag type
enum class MMAFrag : uint32_t {
  a = 0,
  b = 1,
  c = 2,
};

::std::optional<MMAFrag> symbolizeMMAFrag(uint32_t);
::llvm::StringRef stringifyMMAFrag(MMAFrag);
::std::optional<MMAFrag> symbolizeMMAFrag(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForMMAFrag() {
  return 2;
}


inline ::llvm::StringRef stringifyEnum(MMAFrag enumValue) {
  return stringifyMMAFrag(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<MMAFrag> symbolizeEnum<MMAFrag>(::llvm::StringRef str) {
  return symbolizeMMAFrag(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::MMAFrag, ::mlir::NVVM::MMAFrag> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::MMAFrag> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM MMA frag type");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::MMAFrag> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::MMAFrag>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [a, b, c] for NVVM MMA frag type, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::MMAFrag>, std::optional<::mlir::NVVM::MMAFrag>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::MMAFrag>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::MMAFrag>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::MMAFrag> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::MMAFrag>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [a, b, c] for NVVM MMA frag type, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::MMAFrag value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::MMAFrag> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::MMAFrag getEmptyKey() {
    return static_cast<::mlir::NVVM::MMAFrag>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::MMAFrag getTombstoneKey() {
    return static_cast<::mlir::NVVM::MMAFrag>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::MMAFrag &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::MMAFrag &lhs, const ::mlir::NVVM::MMAFrag &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// MMA overflow options
enum class MMAIntOverflow : uint32_t {
  satfinite = 1,
  wrapped = 0,
};

::std::optional<MMAIntOverflow> symbolizeMMAIntOverflow(uint32_t);
::llvm::StringRef stringifyMMAIntOverflow(MMAIntOverflow);
::std::optional<MMAIntOverflow> symbolizeMMAIntOverflow(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForMMAIntOverflow() {
  return 1;
}


inline ::llvm::StringRef stringifyEnum(MMAIntOverflow enumValue) {
  return stringifyMMAIntOverflow(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<MMAIntOverflow> symbolizeEnum<MMAIntOverflow>(::llvm::StringRef str) {
  return symbolizeMMAIntOverflow(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::MMAIntOverflow, ::mlir::NVVM::MMAIntOverflow> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::MMAIntOverflow> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for MMA overflow options");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::MMAIntOverflow> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::MMAIntOverflow>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [satfinite, wrapped] for MMA overflow options, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::MMAIntOverflow>, std::optional<::mlir::NVVM::MMAIntOverflow>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::MMAIntOverflow>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::MMAIntOverflow>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::MMAIntOverflow> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::MMAIntOverflow>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [satfinite, wrapped] for MMA overflow options, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::MMAIntOverflow value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::MMAIntOverflow> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::MMAIntOverflow getEmptyKey() {
    return static_cast<::mlir::NVVM::MMAIntOverflow>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::MMAIntOverflow getTombstoneKey() {
    return static_cast<::mlir::NVVM::MMAIntOverflow>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::MMAIntOverflow &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::MMAIntOverflow &lhs, const ::mlir::NVVM::MMAIntOverflow &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM MMA layout
enum class MMALayout : uint32_t {
  row = 0,
  col = 1,
};

::std::optional<MMALayout> symbolizeMMALayout(uint32_t);
::llvm::StringRef stringifyMMALayout(MMALayout);
::std::optional<MMALayout> symbolizeMMALayout(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForMMALayout() {
  return 1;
}


inline ::llvm::StringRef stringifyEnum(MMALayout enumValue) {
  return stringifyMMALayout(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<MMALayout> symbolizeEnum<MMALayout>(::llvm::StringRef str) {
  return symbolizeMMALayout(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::MMALayout, ::mlir::NVVM::MMALayout> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::MMALayout> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM MMA layout");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::MMALayout> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::MMALayout>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [row, col] for NVVM MMA layout, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::MMALayout>, std::optional<::mlir::NVVM::MMALayout>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::MMALayout>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::MMALayout>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::MMALayout> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::MMALayout>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [row, col] for NVVM MMA layout, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::MMALayout value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::MMALayout> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::MMALayout getEmptyKey() {
    return static_cast<::mlir::NVVM::MMALayout>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::MMALayout getTombstoneKey() {
    return static_cast<::mlir::NVVM::MMALayout>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::MMALayout &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::MMALayout &lhs, const ::mlir::NVVM::MMALayout &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM MMA types
enum class MMATypes : uint32_t {
  f16 = 0,
  f32 = 1,
  tf32 = 2,
  bf16 = 9,
  s8 = 4,
  u8 = 3,
  s32 = 5,
  s4 = 8,
  u4 = 7,
  b1 = 6,
  f64 = 10,
};

::std::optional<MMATypes> symbolizeMMATypes(uint32_t);
::llvm::StringRef stringifyMMATypes(MMATypes);
::std::optional<MMATypes> symbolizeMMATypes(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForMMATypes() {
  return 10;
}


inline ::llvm::StringRef stringifyEnum(MMATypes enumValue) {
  return stringifyMMATypes(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<MMATypes> symbolizeEnum<MMATypes>(::llvm::StringRef str) {
  return symbolizeMMATypes(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::MMATypes, ::mlir::NVVM::MMATypes> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::MMATypes> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM MMA types");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::MMATypes> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::MMATypes>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [f16, f32, tf32, bf16, s8, u8, s32, s4, u4, b1, f64] for NVVM MMA types, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::MMATypes>, std::optional<::mlir::NVVM::MMATypes>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::MMATypes>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::MMATypes>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::MMATypes> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::MMATypes>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [f16, f32, tf32, bf16, s8, u8, s32, s4, u4, b1, f64] for NVVM MMA types, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::MMATypes value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::MMATypes> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::MMATypes getEmptyKey() {
    return static_cast<::mlir::NVVM::MMATypes>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::MMATypes getTombstoneKey() {
    return static_cast<::mlir::NVVM::MMATypes>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::MMATypes &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::MMATypes &lhs, const ::mlir::NVVM::MMATypes &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM match sync kind
enum class MatchSyncKind : uint32_t {
  any = 0,
  all = 1,
};

::std::optional<MatchSyncKind> symbolizeMatchSyncKind(uint32_t);
::llvm::StringRef stringifyMatchSyncKind(MatchSyncKind);
::std::optional<MatchSyncKind> symbolizeMatchSyncKind(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForMatchSyncKind() {
  return 1;
}


inline ::llvm::StringRef stringifyEnum(MatchSyncKind enumValue) {
  return stringifyMatchSyncKind(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<MatchSyncKind> symbolizeEnum<MatchSyncKind>(::llvm::StringRef str) {
  return symbolizeMatchSyncKind(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::MatchSyncKind, ::mlir::NVVM::MatchSyncKind> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::MatchSyncKind> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM match sync kind");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::MatchSyncKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::MatchSyncKind>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [any, all] for NVVM match sync kind, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::MatchSyncKind>, std::optional<::mlir::NVVM::MatchSyncKind>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::MatchSyncKind>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::MatchSyncKind>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::MatchSyncKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::MatchSyncKind>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [any, all] for NVVM match sync kind, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::MatchSyncKind value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::MatchSyncKind> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::MatchSyncKind getEmptyKey() {
    return static_cast<::mlir::NVVM::MatchSyncKind>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::MatchSyncKind getTombstoneKey() {
    return static_cast<::mlir::NVVM::MatchSyncKind>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::MatchSyncKind &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::MatchSyncKind &lhs, const ::mlir::NVVM::MatchSyncKind &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM Memory Scope kind
enum class MemScopeKind : uint32_t {
  CTA = 0,
  CLUSTER = 1,
  GPU = 2,
  SYS = 3,
};

::std::optional<MemScopeKind> symbolizeMemScopeKind(uint32_t);
::llvm::StringRef stringifyMemScopeKind(MemScopeKind);
::std::optional<MemScopeKind> symbolizeMemScopeKind(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForMemScopeKind() {
  return 3;
}


inline ::llvm::StringRef stringifyEnum(MemScopeKind enumValue) {
  return stringifyMemScopeKind(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<MemScopeKind> symbolizeEnum<MemScopeKind>(::llvm::StringRef str) {
  return symbolizeMemScopeKind(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::MemScopeKind, ::mlir::NVVM::MemScopeKind> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::MemScopeKind> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM Memory Scope kind");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::MemScopeKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::MemScopeKind>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [cta, cluster, gpu, sys] for NVVM Memory Scope kind, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::MemScopeKind>, std::optional<::mlir::NVVM::MemScopeKind>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::MemScopeKind>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::MemScopeKind>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::MemScopeKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::MemScopeKind>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [cta, cluster, gpu, sys] for NVVM Memory Scope kind, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::MemScopeKind value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::MemScopeKind> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::MemScopeKind getEmptyKey() {
    return static_cast<::mlir::NVVM::MemScopeKind>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::MemScopeKind getTombstoneKey() {
    return static_cast<::mlir::NVVM::MemScopeKind>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::MemScopeKind &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::MemScopeKind &lhs, const ::mlir::NVVM::MemScopeKind &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM Prefetch Cache Level
enum class PrefetchCacheLevel : uint32_t {
  L1 = 0,
  L2 = 1,
};

::std::optional<PrefetchCacheLevel> symbolizePrefetchCacheLevel(uint32_t);
::llvm::StringRef stringifyPrefetchCacheLevel(PrefetchCacheLevel);
::std::optional<PrefetchCacheLevel> symbolizePrefetchCacheLevel(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForPrefetchCacheLevel() {
  return 1;
}


inline ::llvm::StringRef stringifyEnum(PrefetchCacheLevel enumValue) {
  return stringifyPrefetchCacheLevel(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<PrefetchCacheLevel> symbolizeEnum<PrefetchCacheLevel>(::llvm::StringRef str) {
  return symbolizePrefetchCacheLevel(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::PrefetchCacheLevel, ::mlir::NVVM::PrefetchCacheLevel> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::PrefetchCacheLevel> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM Prefetch Cache Level");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::PrefetchCacheLevel> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::PrefetchCacheLevel>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [L1, L2] for NVVM Prefetch Cache Level, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::PrefetchCacheLevel>, std::optional<::mlir::NVVM::PrefetchCacheLevel>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::PrefetchCacheLevel>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::PrefetchCacheLevel>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::PrefetchCacheLevel> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::PrefetchCacheLevel>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [L1, L2] for NVVM Prefetch Cache Level, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::PrefetchCacheLevel value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::PrefetchCacheLevel> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::PrefetchCacheLevel getEmptyKey() {
    return static_cast<::mlir::NVVM::PrefetchCacheLevel>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::PrefetchCacheLevel getTombstoneKey() {
    return static_cast<::mlir::NVVM::PrefetchCacheLevel>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::PrefetchCacheLevel &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::PrefetchCacheLevel &lhs, const ::mlir::NVVM::PrefetchCacheLevel &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// Proxy kind
enum class ProxyKind : uint32_t {
  alias = 0,
  async = 1,
  async_global = 2,
  async_shared = 3,
  TENSORMAP = 4,
  GENERIC = 5,
};

::std::optional<ProxyKind> symbolizeProxyKind(uint32_t);
::llvm::StringRef stringifyProxyKind(ProxyKind);
::std::optional<ProxyKind> symbolizeProxyKind(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForProxyKind() {
  return 5;
}


inline ::llvm::StringRef stringifyEnum(ProxyKind enumValue) {
  return stringifyProxyKind(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<ProxyKind> symbolizeEnum<ProxyKind>(::llvm::StringRef str) {
  return symbolizeProxyKind(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::ProxyKind, ::mlir::NVVM::ProxyKind> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::ProxyKind> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for Proxy kind");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::ProxyKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::ProxyKind>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [alias, async, async.global, async.shared, tensormap, generic] for Proxy kind, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::ProxyKind>, std::optional<::mlir::NVVM::ProxyKind>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::ProxyKind>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::ProxyKind>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::ProxyKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::ProxyKind>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [alias, async, async.global, async.shared, tensormap, generic] for Proxy kind, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::ProxyKind value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::ProxyKind> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::ProxyKind getEmptyKey() {
    return static_cast<::mlir::NVVM::ProxyKind>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::ProxyKind getTombstoneKey() {
    return static_cast<::mlir::NVVM::ProxyKind>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::ProxyKind &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::ProxyKind &lhs, const ::mlir::NVVM::ProxyKind &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM redux kind
enum class ReduxKind : uint32_t {
  ADD = 1,
  AND = 2,
  MAX = 3,
  MIN = 4,
  OR = 5,
  UMAX = 6,
  UMIN = 7,
  XOR = 8,
  FMIN = 9,
  FMAX = 10,
};

::std::optional<ReduxKind> symbolizeReduxKind(uint32_t);
::llvm::StringRef stringifyReduxKind(ReduxKind);
::std::optional<ReduxKind> symbolizeReduxKind(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForReduxKind() {
  return 10;
}


inline ::llvm::StringRef stringifyEnum(ReduxKind enumValue) {
  return stringifyReduxKind(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<ReduxKind> symbolizeEnum<ReduxKind>(::llvm::StringRef str) {
  return symbolizeReduxKind(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::ReduxKind, ::mlir::NVVM::ReduxKind> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::ReduxKind> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM redux kind");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::ReduxKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::ReduxKind>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [add, and, max, min, or, umax, umin, xor, fmin, fmax] for NVVM redux kind, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::ReduxKind>, std::optional<::mlir::NVVM::ReduxKind>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::ReduxKind>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::ReduxKind>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::ReduxKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::ReduxKind>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [add, and, max, min, or, umax, umin, xor, fmin, fmax] for NVVM redux kind, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::ReduxKind value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::ReduxKind> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::ReduxKind getEmptyKey() {
    return static_cast<::mlir::NVVM::ReduxKind>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::ReduxKind getTombstoneKey() {
    return static_cast<::mlir::NVVM::ReduxKind>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::ReduxKind &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::ReduxKind &lhs, const ::mlir::NVVM::ReduxKind &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM SaturationMode kind
enum class SaturationMode : uint32_t {
  NONE = 0,
  SATFINITE = 1,
};

::std::optional<SaturationMode> symbolizeSaturationMode(uint32_t);
::llvm::StringRef stringifySaturationMode(SaturationMode);
::std::optional<SaturationMode> symbolizeSaturationMode(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForSaturationMode() {
  return 1;
}


inline ::llvm::StringRef stringifyEnum(SaturationMode enumValue) {
  return stringifySaturationMode(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<SaturationMode> symbolizeEnum<SaturationMode>(::llvm::StringRef str) {
  return symbolizeSaturationMode(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::SaturationMode, ::mlir::NVVM::SaturationMode> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::SaturationMode> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM SaturationMode kind");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::SaturationMode> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::SaturationMode>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [none, satfinite] for NVVM SaturationMode kind, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::SaturationMode>, std::optional<::mlir::NVVM::SaturationMode>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::SaturationMode>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::SaturationMode>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::SaturationMode> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::SaturationMode>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [none, satfinite] for NVVM SaturationMode kind, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::SaturationMode value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::SaturationMode> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::SaturationMode getEmptyKey() {
    return static_cast<::mlir::NVVM::SaturationMode>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::SaturationMode getTombstoneKey() {
    return static_cast<::mlir::NVVM::SaturationMode>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::SaturationMode &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::SaturationMode &lhs, const ::mlir::NVVM::SaturationMode &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM set max register action
enum class SetMaxRegisterAction : uint32_t {
  decrease = 1,
  increase = 0,
};

::std::optional<SetMaxRegisterAction> symbolizeSetMaxRegisterAction(uint32_t);
::llvm::StringRef stringifySetMaxRegisterAction(SetMaxRegisterAction);
::std::optional<SetMaxRegisterAction> symbolizeSetMaxRegisterAction(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForSetMaxRegisterAction() {
  return 1;
}


inline ::llvm::StringRef stringifyEnum(SetMaxRegisterAction enumValue) {
  return stringifySetMaxRegisterAction(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<SetMaxRegisterAction> symbolizeEnum<SetMaxRegisterAction>(::llvm::StringRef str) {
  return symbolizeSetMaxRegisterAction(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::SetMaxRegisterAction, ::mlir::NVVM::SetMaxRegisterAction> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::SetMaxRegisterAction> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM set max register action");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::SetMaxRegisterAction> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::SetMaxRegisterAction>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [decrease, increase] for NVVM set max register action, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::SetMaxRegisterAction>, std::optional<::mlir::NVVM::SetMaxRegisterAction>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::SetMaxRegisterAction>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::SetMaxRegisterAction>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::SetMaxRegisterAction> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::SetMaxRegisterAction>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [decrease, increase] for NVVM set max register action, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::SetMaxRegisterAction value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::SetMaxRegisterAction> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::SetMaxRegisterAction getEmptyKey() {
    return static_cast<::mlir::NVVM::SetMaxRegisterAction>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::SetMaxRegisterAction getTombstoneKey() {
    return static_cast<::mlir::NVVM::SetMaxRegisterAction>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::SetMaxRegisterAction &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::SetMaxRegisterAction &lhs, const ::mlir::NVVM::SetMaxRegisterAction &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// Shared memory space
enum class SharedSpace : uint32_t {
  shared_cta = 0,
  shared_cluster = 1,
};

::std::optional<SharedSpace> symbolizeSharedSpace(uint32_t);
::llvm::StringRef stringifySharedSpace(SharedSpace);
::std::optional<SharedSpace> symbolizeSharedSpace(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForSharedSpace() {
  return 1;
}


inline ::llvm::StringRef stringifyEnum(SharedSpace enumValue) {
  return stringifySharedSpace(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<SharedSpace> symbolizeEnum<SharedSpace>(::llvm::StringRef str) {
  return symbolizeSharedSpace(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::SharedSpace, ::mlir::NVVM::SharedSpace> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::SharedSpace> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for Shared memory space");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::SharedSpace> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::SharedSpace>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [cta, cluster] for Shared memory space, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::SharedSpace>, std::optional<::mlir::NVVM::SharedSpace>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::SharedSpace>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::SharedSpace>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::SharedSpace> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::SharedSpace>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [cta, cluster] for Shared memory space, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::SharedSpace value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::SharedSpace> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::SharedSpace getEmptyKey() {
    return static_cast<::mlir::NVVM::SharedSpace>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::SharedSpace getTombstoneKey() {
    return static_cast<::mlir::NVVM::SharedSpace>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::SharedSpace &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::SharedSpace &lhs, const ::mlir::NVVM::SharedSpace &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM shuffle kind
enum class ShflKind : uint32_t {
  bfly = 0,
  up = 1,
  down = 2,
  idx = 3,
};

::std::optional<ShflKind> symbolizeShflKind(uint32_t);
::llvm::StringRef stringifyShflKind(ShflKind);
::std::optional<ShflKind> symbolizeShflKind(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForShflKind() {
  return 3;
}


inline ::llvm::StringRef stringifyEnum(ShflKind enumValue) {
  return stringifyShflKind(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<ShflKind> symbolizeEnum<ShflKind>(::llvm::StringRef str) {
  return symbolizeShflKind(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::ShflKind, ::mlir::NVVM::ShflKind> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::ShflKind> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM shuffle kind");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::ShflKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::ShflKind>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [bfly, up, down, idx] for NVVM shuffle kind, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::ShflKind>, std::optional<::mlir::NVVM::ShflKind>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::ShflKind>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::ShflKind>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::ShflKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::ShflKind>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [bfly, up, down, idx] for NVVM shuffle kind, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::ShflKind value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::ShflKind> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::ShflKind getEmptyKey() {
    return static_cast<::mlir::NVVM::ShflKind>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::ShflKind getTombstoneKey() {
    return static_cast<::mlir::NVVM::ShflKind>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::ShflKind &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::ShflKind &lhs, const ::mlir::NVVM::ShflKind &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM TMA redux kind
enum class TMAReduxKind : uint32_t {
  ADD = 0,
  MAX = 2,
  MIN = 1,
  INC = 3,
  DEC = 4,
  AND = 5,
  OR = 6,
  XOR = 7,
};

::std::optional<TMAReduxKind> symbolizeTMAReduxKind(uint32_t);
::llvm::StringRef stringifyTMAReduxKind(TMAReduxKind);
::std::optional<TMAReduxKind> symbolizeTMAReduxKind(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForTMAReduxKind() {
  return 7;
}


inline ::llvm::StringRef stringifyEnum(TMAReduxKind enumValue) {
  return stringifyTMAReduxKind(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<TMAReduxKind> symbolizeEnum<TMAReduxKind>(::llvm::StringRef str) {
  return symbolizeTMAReduxKind(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::TMAReduxKind, ::mlir::NVVM::TMAReduxKind> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::TMAReduxKind> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM TMA redux kind");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::TMAReduxKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::TMAReduxKind>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [add, max, min, inc, dec, and, or, xor] for NVVM TMA redux kind, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::TMAReduxKind>, std::optional<::mlir::NVVM::TMAReduxKind>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::TMAReduxKind>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::TMAReduxKind>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::TMAReduxKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::TMAReduxKind>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [add, max, min, inc, dec, and, or, xor] for NVVM TMA redux kind, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::TMAReduxKind value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::TMAReduxKind> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::TMAReduxKind getEmptyKey() {
    return static_cast<::mlir::NVVM::TMAReduxKind>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::TMAReduxKind getTombstoneKey() {
    return static_cast<::mlir::NVVM::TMAReduxKind>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::TMAReduxKind &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::TMAReduxKind &lhs, const ::mlir::NVVM::TMAReduxKind &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM TMA Store Mode
enum class TMAStoreMode : uint32_t {
  TILE = 0,
  IM2COL = 1,
};

::std::optional<TMAStoreMode> symbolizeTMAStoreMode(uint32_t);
::llvm::StringRef stringifyTMAStoreMode(TMAStoreMode);
::std::optional<TMAStoreMode> symbolizeTMAStoreMode(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForTMAStoreMode() {
  return 1;
}


inline ::llvm::StringRef stringifyEnum(TMAStoreMode enumValue) {
  return stringifyTMAStoreMode(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<TMAStoreMode> symbolizeEnum<TMAStoreMode>(::llvm::StringRef str) {
  return symbolizeTMAStoreMode(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::TMAStoreMode, ::mlir::NVVM::TMAStoreMode> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::TMAStoreMode> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM TMA Store Mode");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::TMAStoreMode> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::TMAStoreMode>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [tile, im2col] for NVVM TMA Store Mode, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::TMAStoreMode>, std::optional<::mlir::NVVM::TMAStoreMode>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::TMAStoreMode>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::TMAStoreMode>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::TMAStoreMode> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::TMAStoreMode>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [tile, im2col] for NVVM TMA Store Mode, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::TMAStoreMode value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::TMAStoreMode> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::TMAStoreMode getEmptyKey() {
    return static_cast<::mlir::NVVM::TMAStoreMode>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::TMAStoreMode getTombstoneKey() {
    return static_cast<::mlir::NVVM::TMAStoreMode>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::TMAStoreMode &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::TMAStoreMode &lhs, const ::mlir::NVVM::TMAStoreMode &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// tcgen05 cp multicast
enum class Tcgen05CpMulticast : uint32_t {
  NONE = 0,
  WARPX2_02_13 = 1,
  WARPX2_01_23 = 2,
  WARPX4 = 3,
};

::std::optional<Tcgen05CpMulticast> symbolizeTcgen05CpMulticast(uint32_t);
::llvm::StringRef stringifyTcgen05CpMulticast(Tcgen05CpMulticast);
::std::optional<Tcgen05CpMulticast> symbolizeTcgen05CpMulticast(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForTcgen05CpMulticast() {
  return 3;
}


inline ::llvm::StringRef stringifyEnum(Tcgen05CpMulticast enumValue) {
  return stringifyTcgen05CpMulticast(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<Tcgen05CpMulticast> symbolizeEnum<Tcgen05CpMulticast>(::llvm::StringRef str) {
  return symbolizeTcgen05CpMulticast(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::Tcgen05CpMulticast, ::mlir::NVVM::Tcgen05CpMulticast> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::Tcgen05CpMulticast> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for tcgen05 cp multicast");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::Tcgen05CpMulticast> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::Tcgen05CpMulticast>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [none, warpx2_02_13, warpx2_01_23, warpx4] for tcgen05 cp multicast, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::Tcgen05CpMulticast>, std::optional<::mlir::NVVM::Tcgen05CpMulticast>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::Tcgen05CpMulticast>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::Tcgen05CpMulticast>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::Tcgen05CpMulticast> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::Tcgen05CpMulticast>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [none, warpx2_02_13, warpx2_01_23, warpx4] for tcgen05 cp multicast, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::Tcgen05CpMulticast value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::Tcgen05CpMulticast> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::Tcgen05CpMulticast getEmptyKey() {
    return static_cast<::mlir::NVVM::Tcgen05CpMulticast>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::Tcgen05CpMulticast getTombstoneKey() {
    return static_cast<::mlir::NVVM::Tcgen05CpMulticast>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::Tcgen05CpMulticast &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::Tcgen05CpMulticast &lhs, const ::mlir::NVVM::Tcgen05CpMulticast &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// tcgen05 cp shapes
enum class Tcgen05CpShape : uint32_t {
  SHAPE_128x256b = 0,
  SHAPE_4x256b = 1,
  SHAPE_128x128b = 2,
  SHAPE_64x128b = 3,
  SHAPE_32x128b = 4,
};

::std::optional<Tcgen05CpShape> symbolizeTcgen05CpShape(uint32_t);
::llvm::StringRef stringifyTcgen05CpShape(Tcgen05CpShape);
::std::optional<Tcgen05CpShape> symbolizeTcgen05CpShape(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForTcgen05CpShape() {
  return 4;
}


inline ::llvm::StringRef stringifyEnum(Tcgen05CpShape enumValue) {
  return stringifyTcgen05CpShape(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<Tcgen05CpShape> symbolizeEnum<Tcgen05CpShape>(::llvm::StringRef str) {
  return symbolizeTcgen05CpShape(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::Tcgen05CpShape, ::mlir::NVVM::Tcgen05CpShape> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::Tcgen05CpShape> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for tcgen05 cp shapes");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::Tcgen05CpShape> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::Tcgen05CpShape>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [shape_128x256b, shape_4x256b, shape_128x128b, shape_64x128b, shape_32x128b] for tcgen05 cp shapes, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::Tcgen05CpShape>, std::optional<::mlir::NVVM::Tcgen05CpShape>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::Tcgen05CpShape>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::Tcgen05CpShape>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::Tcgen05CpShape> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::Tcgen05CpShape>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [shape_128x256b, shape_4x256b, shape_128x128b, shape_64x128b, shape_32x128b] for tcgen05 cp shapes, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::Tcgen05CpShape value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::Tcgen05CpShape> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::Tcgen05CpShape getEmptyKey() {
    return static_cast<::mlir::NVVM::Tcgen05CpShape>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::Tcgen05CpShape getTombstoneKey() {
    return static_cast<::mlir::NVVM::Tcgen05CpShape>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::Tcgen05CpShape &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::Tcgen05CpShape &lhs, const ::mlir::NVVM::Tcgen05CpShape &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// tcgen05 cp source format
enum class Tcgen05CpSrcFormat : uint32_t {
  B6x16_P32 = 0,
  B4x16_P64 = 1,
};

::std::optional<Tcgen05CpSrcFormat> symbolizeTcgen05CpSrcFormat(uint32_t);
::llvm::StringRef stringifyTcgen05CpSrcFormat(Tcgen05CpSrcFormat);
::std::optional<Tcgen05CpSrcFormat> symbolizeTcgen05CpSrcFormat(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForTcgen05CpSrcFormat() {
  return 1;
}


inline ::llvm::StringRef stringifyEnum(Tcgen05CpSrcFormat enumValue) {
  return stringifyTcgen05CpSrcFormat(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<Tcgen05CpSrcFormat> symbolizeEnum<Tcgen05CpSrcFormat>(::llvm::StringRef str) {
  return symbolizeTcgen05CpSrcFormat(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::Tcgen05CpSrcFormat, ::mlir::NVVM::Tcgen05CpSrcFormat> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::Tcgen05CpSrcFormat> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for tcgen05 cp source format");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::Tcgen05CpSrcFormat> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::Tcgen05CpSrcFormat>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [b6x16_p32, b4x16_p64] for tcgen05 cp source format, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::Tcgen05CpSrcFormat>, std::optional<::mlir::NVVM::Tcgen05CpSrcFormat>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::Tcgen05CpSrcFormat>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::Tcgen05CpSrcFormat>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::Tcgen05CpSrcFormat> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::Tcgen05CpSrcFormat>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [b6x16_p32, b4x16_p64] for tcgen05 cp source format, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::Tcgen05CpSrcFormat value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::Tcgen05CpSrcFormat> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::Tcgen05CpSrcFormat getEmptyKey() {
    return static_cast<::mlir::NVVM::Tcgen05CpSrcFormat>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::Tcgen05CpSrcFormat getTombstoneKey() {
    return static_cast<::mlir::NVVM::Tcgen05CpSrcFormat>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::Tcgen05CpSrcFormat &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::Tcgen05CpSrcFormat &lhs, const ::mlir::NVVM::Tcgen05CpSrcFormat &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM Tcgen05 fence kind
enum class Tcgen05FenceKind : uint32_t {
  BEFORE_THREAD_SYNC = 0,
  AFTER_THREAD_SYNC = 1,
};

::std::optional<Tcgen05FenceKind> symbolizeTcgen05FenceKind(uint32_t);
::llvm::StringRef stringifyTcgen05FenceKind(Tcgen05FenceKind);
::std::optional<Tcgen05FenceKind> symbolizeTcgen05FenceKind(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForTcgen05FenceKind() {
  return 1;
}


inline ::llvm::StringRef stringifyEnum(Tcgen05FenceKind enumValue) {
  return stringifyTcgen05FenceKind(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<Tcgen05FenceKind> symbolizeEnum<Tcgen05FenceKind>(::llvm::StringRef str) {
  return symbolizeTcgen05FenceKind(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::Tcgen05FenceKind, ::mlir::NVVM::Tcgen05FenceKind> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::Tcgen05FenceKind> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM Tcgen05 fence kind");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::Tcgen05FenceKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::Tcgen05FenceKind>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [before, after] for NVVM Tcgen05 fence kind, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::Tcgen05FenceKind>, std::optional<::mlir::NVVM::Tcgen05FenceKind>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::Tcgen05FenceKind>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::Tcgen05FenceKind>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::Tcgen05FenceKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::Tcgen05FenceKind>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [before, after] for NVVM Tcgen05 fence kind, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::Tcgen05FenceKind value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::Tcgen05FenceKind> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::Tcgen05FenceKind getEmptyKey() {
    return static_cast<::mlir::NVVM::Tcgen05FenceKind>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::Tcgen05FenceKind getTombstoneKey() {
    return static_cast<::mlir::NVVM::Tcgen05FenceKind>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::Tcgen05FenceKind &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::Tcgen05FenceKind &lhs, const ::mlir::NVVM::Tcgen05FenceKind &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM Tcgen05 group kind
enum class Tcgen05GroupKind : uint32_t {
  CTA_1 = 0,
  CTA_2 = 1,
};

::std::optional<Tcgen05GroupKind> symbolizeTcgen05GroupKind(uint32_t);
::llvm::StringRef stringifyTcgen05GroupKind(Tcgen05GroupKind);
::std::optional<Tcgen05GroupKind> symbolizeTcgen05GroupKind(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForTcgen05GroupKind() {
  return 1;
}


inline ::llvm::StringRef stringifyEnum(Tcgen05GroupKind enumValue) {
  return stringifyTcgen05GroupKind(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<Tcgen05GroupKind> symbolizeEnum<Tcgen05GroupKind>(::llvm::StringRef str) {
  return symbolizeTcgen05GroupKind(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::Tcgen05GroupKind, ::mlir::NVVM::Tcgen05GroupKind> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::Tcgen05GroupKind> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM Tcgen05 group kind");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::Tcgen05GroupKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::Tcgen05GroupKind>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [cta_1, cta_2] for NVVM Tcgen05 group kind, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::Tcgen05GroupKind>, std::optional<::mlir::NVVM::Tcgen05GroupKind>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::Tcgen05GroupKind>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::Tcgen05GroupKind>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::Tcgen05GroupKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::Tcgen05GroupKind>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [cta_1, cta_2] for NVVM Tcgen05 group kind, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::Tcgen05GroupKind value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::Tcgen05GroupKind> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::Tcgen05GroupKind getEmptyKey() {
    return static_cast<::mlir::NVVM::Tcgen05GroupKind>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::Tcgen05GroupKind getTombstoneKey() {
    return static_cast<::mlir::NVVM::Tcgen05GroupKind>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::Tcgen05GroupKind &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::Tcgen05GroupKind &lhs, const ::mlir::NVVM::Tcgen05GroupKind &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// allowed 32-bit signless integer cases: 0, 1, 2, 3, 4
enum class Tcgen05LdStShape : uint32_t {
  SHAPE_16X64B = 0,
  SHAPE_16X128B = 1,
  SHAPE_16X256B = 2,
  SHAPE_32X32B = 3,
  SHAPE_16X32BX2 = 4,
};

::std::optional<Tcgen05LdStShape> symbolizeTcgen05LdStShape(uint32_t);
::llvm::StringRef stringifyTcgen05LdStShape(Tcgen05LdStShape);
::std::optional<Tcgen05LdStShape> symbolizeTcgen05LdStShape(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForTcgen05LdStShape() {
  return 4;
}


inline ::llvm::StringRef stringifyEnum(Tcgen05LdStShape enumValue) {
  return stringifyTcgen05LdStShape(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<Tcgen05LdStShape> symbolizeEnum<Tcgen05LdStShape>(::llvm::StringRef str) {
  return symbolizeTcgen05LdStShape(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::Tcgen05LdStShape, ::mlir::NVVM::Tcgen05LdStShape> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::Tcgen05LdStShape> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for allowed 32-bit signless integer cases: 0, 1, 2, 3, 4");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::Tcgen05LdStShape> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::Tcgen05LdStShape>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [shape_16x64b, shape_16x128b, shape_16x256b, shape_32x32b, shape_16x32bx2] for allowed 32-bit signless integer cases: 0, 1, 2, 3, 4, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::Tcgen05LdStShape>, std::optional<::mlir::NVVM::Tcgen05LdStShape>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::Tcgen05LdStShape>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::Tcgen05LdStShape>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::Tcgen05LdStShape> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::Tcgen05LdStShape>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [shape_16x64b, shape_16x128b, shape_16x256b, shape_32x32b, shape_16x32bx2] for allowed 32-bit signless integer cases: 0, 1, 2, 3, 4, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::Tcgen05LdStShape value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::Tcgen05LdStShape> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::Tcgen05LdStShape getEmptyKey() {
    return static_cast<::mlir::NVVM::Tcgen05LdStShape>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::Tcgen05LdStShape getTombstoneKey() {
    return static_cast<::mlir::NVVM::Tcgen05LdStShape>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::Tcgen05LdStShape &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::Tcgen05LdStShape &lhs, const ::mlir::NVVM::Tcgen05LdStShape &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM Tcgen05 wait kind
enum class Tcgen05WaitKind : uint32_t {
  LOAD = 0,
  STORE = 1,
};

::std::optional<Tcgen05WaitKind> symbolizeTcgen05WaitKind(uint32_t);
::llvm::StringRef stringifyTcgen05WaitKind(Tcgen05WaitKind);
::std::optional<Tcgen05WaitKind> symbolizeTcgen05WaitKind(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForTcgen05WaitKind() {
  return 1;
}


inline ::llvm::StringRef stringifyEnum(Tcgen05WaitKind enumValue) {
  return stringifyTcgen05WaitKind(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<Tcgen05WaitKind> symbolizeEnum<Tcgen05WaitKind>(::llvm::StringRef str) {
  return symbolizeTcgen05WaitKind(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::Tcgen05WaitKind, ::mlir::NVVM::Tcgen05WaitKind> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::Tcgen05WaitKind> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM Tcgen05 wait kind");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::Tcgen05WaitKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::Tcgen05WaitKind>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [load, store] for NVVM Tcgen05 wait kind, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::Tcgen05WaitKind>, std::optional<::mlir::NVVM::Tcgen05WaitKind>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::Tcgen05WaitKind>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::Tcgen05WaitKind>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::Tcgen05WaitKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::Tcgen05WaitKind>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [load, store] for NVVM Tcgen05 wait kind, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::Tcgen05WaitKind value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::Tcgen05WaitKind> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::Tcgen05WaitKind getEmptyKey() {
    return static_cast<::mlir::NVVM::Tcgen05WaitKind>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::Tcgen05WaitKind getTombstoneKey() {
    return static_cast<::mlir::NVVM::Tcgen05WaitKind>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::Tcgen05WaitKind &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::Tcgen05WaitKind &lhs, const ::mlir::NVVM::Tcgen05WaitKind &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM vote sync kind
enum class VoteSyncKind : uint32_t {
  any = 0,
  all = 1,
  ballot = 2,
  uni = 3,
};

::std::optional<VoteSyncKind> symbolizeVoteSyncKind(uint32_t);
::llvm::StringRef stringifyVoteSyncKind(VoteSyncKind);
::std::optional<VoteSyncKind> symbolizeVoteSyncKind(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForVoteSyncKind() {
  return 3;
}


inline ::llvm::StringRef stringifyEnum(VoteSyncKind enumValue) {
  return stringifyVoteSyncKind(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<VoteSyncKind> symbolizeEnum<VoteSyncKind>(::llvm::StringRef str) {
  return symbolizeVoteSyncKind(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::VoteSyncKind, ::mlir::NVVM::VoteSyncKind> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::VoteSyncKind> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM vote sync kind");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::VoteSyncKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::VoteSyncKind>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [any, all, ballot, uni] for NVVM vote sync kind, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::VoteSyncKind>, std::optional<::mlir::NVVM::VoteSyncKind>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::VoteSyncKind>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::VoteSyncKind>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::VoteSyncKind> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::VoteSyncKind>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [any, all, ballot, uni] for NVVM vote sync kind, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::VoteSyncKind value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::VoteSyncKind> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::VoteSyncKind getEmptyKey() {
    return static_cast<::mlir::NVVM::VoteSyncKind>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::VoteSyncKind getTombstoneKey() {
    return static_cast<::mlir::NVVM::VoteSyncKind>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::VoteSyncKind &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::VoteSyncKind &lhs, const ::mlir::NVVM::VoteSyncKind &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// WGMMA overflow options
enum class WGMMAScaleIn : uint32_t {
  one = 1,
  neg,
};

::llvm::StringRef stringifyWGMMAScaleIn(WGMMAScaleIn);
::std::optional<WGMMAScaleIn> symbolizeWGMMAScaleIn(::llvm::StringRef);

inline ::llvm::StringRef stringifyEnum(WGMMAScaleIn enumValue) {
  return stringifyWGMMAScaleIn(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<WGMMAScaleIn> symbolizeEnum<WGMMAScaleIn>(::llvm::StringRef str) {
  return symbolizeWGMMAScaleIn(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::WGMMAScaleIn, ::mlir::NVVM::WGMMAScaleIn> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::WGMMAScaleIn> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for WGMMA overflow options");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::WGMMAScaleIn> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::WGMMAScaleIn>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [one, neg] for WGMMA overflow options, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::WGMMAScaleIn>, std::optional<::mlir::NVVM::WGMMAScaleIn>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::WGMMAScaleIn>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::WGMMAScaleIn>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::WGMMAScaleIn> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::WGMMAScaleIn>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [one, neg] for WGMMA overflow options, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::WGMMAScaleIn value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::WGMMAScaleIn> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::WGMMAScaleIn getEmptyKey() {
    return static_cast<::mlir::NVVM::WGMMAScaleIn>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::WGMMAScaleIn getTombstoneKey() {
    return static_cast<::mlir::NVVM::WGMMAScaleIn>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::WGMMAScaleIn &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::WGMMAScaleIn &lhs, const ::mlir::NVVM::WGMMAScaleIn &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// WGMMA input predicate
enum class WGMMAScaleOut : uint32_t {
  zero = 0,
  one = 1,
};

::std::optional<WGMMAScaleOut> symbolizeWGMMAScaleOut(uint32_t);
::llvm::StringRef stringifyWGMMAScaleOut(WGMMAScaleOut);
::std::optional<WGMMAScaleOut> symbolizeWGMMAScaleOut(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForWGMMAScaleOut() {
  return 1;
}


inline ::llvm::StringRef stringifyEnum(WGMMAScaleOut enumValue) {
  return stringifyWGMMAScaleOut(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<WGMMAScaleOut> symbolizeEnum<WGMMAScaleOut>(::llvm::StringRef str) {
  return symbolizeWGMMAScaleOut(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::WGMMAScaleOut, ::mlir::NVVM::WGMMAScaleOut> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::WGMMAScaleOut> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for WGMMA input predicate");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::WGMMAScaleOut> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::WGMMAScaleOut>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [zero, one] for WGMMA input predicate, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::WGMMAScaleOut>, std::optional<::mlir::NVVM::WGMMAScaleOut>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::WGMMAScaleOut>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::WGMMAScaleOut>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::WGMMAScaleOut> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::WGMMAScaleOut>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [zero, one] for WGMMA input predicate, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::WGMMAScaleOut value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::WGMMAScaleOut> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::WGMMAScaleOut getEmptyKey() {
    return static_cast<::mlir::NVVM::WGMMAScaleOut>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::WGMMAScaleOut getTombstoneKey() {
    return static_cast<::mlir::NVVM::WGMMAScaleOut>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::WGMMAScaleOut &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::WGMMAScaleOut &lhs, const ::mlir::NVVM::WGMMAScaleOut &rhs) {
    return lhs == rhs;
  }
};
}

namespace mlir {
namespace NVVM {
// NVVM WGMMA types
enum class WGMMATypes : uint32_t {
  f16 = 0,
  tf32 = 1,
  u8 = 2,
  s8 = 3,
  b1 = 4,
  bf16 = 5,
  e4m3 = 6,
  e5m2 = 7,
  f32 = 8,
  s32 = 9,
};

::std::optional<WGMMATypes> symbolizeWGMMATypes(uint32_t);
::llvm::StringRef stringifyWGMMATypes(WGMMATypes);
::std::optional<WGMMATypes> symbolizeWGMMATypes(::llvm::StringRef);
inline constexpr unsigned getMaxEnumValForWGMMATypes() {
  return 9;
}


inline ::llvm::StringRef stringifyEnum(WGMMATypes enumValue) {
  return stringifyWGMMATypes(enumValue);
}

template <typename EnumType>
::std::optional<EnumType> symbolizeEnum(::llvm::StringRef);

template <>
inline ::std::optional<WGMMATypes> symbolizeEnum<WGMMATypes>(::llvm::StringRef str) {
  return symbolizeWGMMATypes(str);
}
} // namespace NVVM
} // namespace mlir

namespace mlir {
template <typename T, typename>
struct FieldParser;

template<>
struct FieldParser<::mlir::NVVM::WGMMATypes, ::mlir::NVVM::WGMMATypes> {
  template <typename ParserT>
  static FailureOr<::mlir::NVVM::WGMMATypes> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return parser.emitError(loc, "expected keyword for NVVM WGMMA types");

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::WGMMATypes> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::WGMMATypes>(enumKeyword))
      return *attr;
    return parser.emitError(loc, "expected one of [f16, tf32, u8, s8, b1, bf16, e4m3, e5m2, f32, s32] for NVVM WGMMA types, got: ") << enumKeyword;
  }
};

/// Support for std::optional, useful in attribute/type definition where the enum is
/// used as:
///
///    let parameters = (ins OptionalParameter<"std::optional<TheEnumName>">:$value);
template<>
struct FieldParser<std::optional<::mlir::NVVM::WGMMATypes>, std::optional<::mlir::NVVM::WGMMATypes>> {
  template <typename ParserT>
  static FailureOr<std::optional<::mlir::NVVM::WGMMATypes>> parse(ParserT &parser) {
    // Parse the keyword/string containing the enum.
    std::string enumKeyword;
    auto loc = parser.getCurrentLocation();
    if (failed(parser.parseOptionalKeywordOrString(&enumKeyword)))
      return std::optional<::mlir::NVVM::WGMMATypes>{};

    // Symbolize the keyword.
    if (::std::optional<::mlir::NVVM::WGMMATypes> attr = ::mlir::NVVM::symbolizeEnum<::mlir::NVVM::WGMMATypes>(enumKeyword))
      return attr;
    return parser.emitError(loc, "expected one of [f16, tf32, u8, s8, b1, bf16, e4m3, e5m2, f32, s32] for NVVM WGMMA types, got: ") << enumKeyword;
  }
};
} // namespace mlir

namespace llvm {
inline ::llvm::raw_ostream &operator<<(::llvm::raw_ostream &p, ::mlir::NVVM::WGMMATypes value) {
  auto valueStr = stringifyEnum(value);
  return p << valueStr;
}
} // namespace llvm

namespace llvm {
template<> struct DenseMapInfo<::mlir::NVVM::WGMMATypes> {
  using StorageInfo = ::llvm::DenseMapInfo<uint32_t>;

  static inline ::mlir::NVVM::WGMMATypes getEmptyKey() {
    return static_cast<::mlir::NVVM::WGMMATypes>(StorageInfo::getEmptyKey());
  }

  static inline ::mlir::NVVM::WGMMATypes getTombstoneKey() {
    return static_cast<::mlir::NVVM::WGMMATypes>(StorageInfo::getTombstoneKey());
  }

  static unsigned getHashValue(const ::mlir::NVVM::WGMMATypes &val) {
    return StorageInfo::getHashValue(static_cast<uint32_t>(val));
  }

  static bool isEqual(const ::mlir::NVVM::WGMMATypes &lhs, const ::mlir::NVVM::WGMMATypes &rhs) {
    return lhs == rhs;
  }
};
}

