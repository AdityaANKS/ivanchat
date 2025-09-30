/*===- TableGen'erated file -------------------------------------*- C++ -*-===*\
|*                                                                            *|
|* AttrDef Declarations                                                       *|
|*                                                                            *|
|* Automatically generated file, do not edit!                                 *|
|*                                                                            *|
\*===----------------------------------------------------------------------===*/

#ifdef GET_ATTRDEF_CLASSES
#undef GET_ATTRDEF_CLASSES


namespace mlir {
class AsmParser;
class AsmPrinter;
} // namespace mlir
namespace mlir {
namespace NVVM {
/// NVVM Cache Eviction Priority
/// Enum cases:
/// * evict_normal (`EvictNormal`)
/// * evict_first (`EvictFirst`)
/// * evict_last (`EvictLast`)
/// * evict_unchanged (`EvictUnchanged`)
/// * no_allocate (`NoAllocate`)
class CacheEvictionPriorityAttr;
/// NVVM redux kind
class ReduxKindAttr;
/// Shared memory space
class SharedSpaceAttr;
/// Proxy kind
class ProxyKindAttr;
/// NVVM Memory Scope kind
class MemScopeKindAttr;
/// NVVM set max register action
class SetMaxRegisterActionAttr;
/// NVVM shuffle kind
class ShflKindAttr;
/// NVVM vote sync kind
class VoteSyncKindAttr;
/// NVVM load cache modifier kind
/// Enum attribute of the different kinds of cache operators for load instructions.
/// 
///     [For more information, see PTX ISA](https://docs.nvidia.com/cuda/parallel-thread-execution/#id62)
class LoadCacheModifierKindAttr;
/// NVVM FPRoundingMode kind
class FPRoundingModeAttr;
/// NVVM SaturationMode kind
class SaturationModeAttr;
/// NVVM ConvertFP6Type kind
class ConvertFP6TypeAttr;
/// NVVM ConvertFP8Type kind
class ConvertFP8TypeAttr;
/// MMA binary operations
class MMAB1OpAttr;
/// MMA overflow options
class MMAIntOverflowAttr;
/// Attribute for MMA operation shape.
class MMAShapeAttr;
/// NVVM MMA layout
class MMALayoutAttr;
/// NVVM MMA types
class MMATypesAttr;
/// NVVM MMA frag type
class MMAFragAttr;
/// NVVM Prefetch Cache Level
/// Enum cases:
/// * L1 (`L1`)
/// * L2 (`L2`)
class PrefetchCacheLevelAttr;
/// NVVM TMA Store Mode
class TMAStoreModeAttr;
/// NVVM TMA redux kind
class TMAReduxKindAttr;
/// WGMMA overflow options
class WGMMAScaleInAttr;
/// WGMMA input predicate
class WGMMAScaleOutAttr;
/// NVVM WGMMA types
class WGMMATypesAttr;
/// NVVM match sync kind
class MatchSyncKindAttr;
/// NVVM Tcgen05 group kind
class Tcgen05GroupKindAttr;
/// NVVM Tcgen05 fence kind
class Tcgen05FenceKindAttr;
/// NVVM Tcgen05 wait kind
class Tcgen05WaitKindAttr;
/// tcgen05 cp shapes
class Tcgen05CpShapeAttr;
/// tcgen05 cp multicast
class Tcgen05CpMulticastAttr;
/// tcgen05 cp source format
class Tcgen05CpSrcFormatAttr;
/// allowed 32-bit signless integer cases: 0, 1, 2, 3, 4
class Tcgen05LdStShapeAttr;
/// NVVM DotAccumulateType
class DotAccumulateTypeAttr;
/// GPU target attribute for controlling compilation of NVIDIA targets. All
///     parameters decay into default values if not present.
/// 
///     Examples:
/// 
///     1. Target with default values.
///     ```
///       gpu.module @mymodule [#nvvm.target] attributes {...} {
///         ...
///       }
///     ```
/// 
///     2. Target with `sm_90` chip and fast math.
///     ```
///       gpu.module @mymodule [#nvvm.target<chip = "sm_90", flags = {fast}>] {
///         ...
///       }
///     ```
class NVVMTargetAttr;
namespace detail {
struct CacheEvictionPriorityAttrStorage;
} // namespace detail
class CacheEvictionPriorityAttr : public ::mlir::Attribute::AttrBase<CacheEvictionPriorityAttr, ::mlir::Attribute, detail::CacheEvictionPriorityAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.cache_eviction_priority";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static CacheEvictionPriorityAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::CacheEvictionPriority value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"cache_eviction_priority"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::CacheEvictionPriority getValue() const;
};
namespace detail {
struct ReduxKindAttrStorage;
} // namespace detail
class ReduxKindAttr : public ::mlir::Attribute::AttrBase<ReduxKindAttr, ::mlir::Attribute, detail::ReduxKindAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.redux_kind";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static ReduxKindAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::ReduxKind value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"redux_kind"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::ReduxKind getValue() const;
};
namespace detail {
struct SharedSpaceAttrStorage;
} // namespace detail
class SharedSpaceAttr : public ::mlir::Attribute::AttrBase<SharedSpaceAttr, ::mlir::Attribute, detail::SharedSpaceAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.shared_space";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static SharedSpaceAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::SharedSpace value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"shared_space"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::SharedSpace getValue() const;
};
namespace detail {
struct ProxyKindAttrStorage;
} // namespace detail
class ProxyKindAttr : public ::mlir::Attribute::AttrBase<ProxyKindAttr, ::mlir::Attribute, detail::ProxyKindAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.proxy_kind";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static ProxyKindAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::ProxyKind value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"proxy_kind"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::ProxyKind getValue() const;
};
namespace detail {
struct MemScopeKindAttrStorage;
} // namespace detail
class MemScopeKindAttr : public ::mlir::Attribute::AttrBase<MemScopeKindAttr, ::mlir::Attribute, detail::MemScopeKindAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.mem_scope";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static MemScopeKindAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::MemScopeKind value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"mem_scope"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::MemScopeKind getValue() const;
};
namespace detail {
struct SetMaxRegisterActionAttrStorage;
} // namespace detail
class SetMaxRegisterActionAttr : public ::mlir::Attribute::AttrBase<SetMaxRegisterActionAttr, ::mlir::Attribute, detail::SetMaxRegisterActionAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.action";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static SetMaxRegisterActionAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::SetMaxRegisterAction value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"action"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::SetMaxRegisterAction getValue() const;
};
namespace detail {
struct ShflKindAttrStorage;
} // namespace detail
class ShflKindAttr : public ::mlir::Attribute::AttrBase<ShflKindAttr, ::mlir::Attribute, detail::ShflKindAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.shfl_kind";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static ShflKindAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::ShflKind value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"shfl_kind"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::ShflKind getValue() const;
};
namespace detail {
struct VoteSyncKindAttrStorage;
} // namespace detail
class VoteSyncKindAttr : public ::mlir::Attribute::AttrBase<VoteSyncKindAttr, ::mlir::Attribute, detail::VoteSyncKindAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.vote_sync_kind";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static VoteSyncKindAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::VoteSyncKind value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"vote_sync_kind"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::VoteSyncKind getValue() const;
};
namespace detail {
struct LoadCacheModifierKindAttrStorage;
} // namespace detail
class LoadCacheModifierKindAttr : public ::mlir::Attribute::AttrBase<LoadCacheModifierKindAttr, ::mlir::Attribute, detail::LoadCacheModifierKindAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.load_cache_modifier";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static LoadCacheModifierKindAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::LoadCacheModifierKind value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"load_cache_modifier"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::LoadCacheModifierKind getValue() const;
};
namespace detail {
struct FPRoundingModeAttrStorage;
} // namespace detail
class FPRoundingModeAttr : public ::mlir::Attribute::AttrBase<FPRoundingModeAttr, ::mlir::Attribute, detail::FPRoundingModeAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.fp_rnd_mode";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static FPRoundingModeAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::FPRoundingMode value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"fp_rnd_mode"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::FPRoundingMode getValue() const;
};
namespace detail {
struct SaturationModeAttrStorage;
} // namespace detail
class SaturationModeAttr : public ::mlir::Attribute::AttrBase<SaturationModeAttr, ::mlir::Attribute, detail::SaturationModeAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.sat_mode";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static SaturationModeAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::SaturationMode value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"sat_mode"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::SaturationMode getValue() const;
};
namespace detail {
struct ConvertFP6TypeAttrStorage;
} // namespace detail
class ConvertFP6TypeAttr : public ::mlir::Attribute::AttrBase<ConvertFP6TypeAttr, ::mlir::Attribute, detail::ConvertFP6TypeAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.convert_fp6_type";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static ConvertFP6TypeAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::ConvertFP6Type value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"convert_fp6_type"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::ConvertFP6Type getValue() const;
};
namespace detail {
struct ConvertFP8TypeAttrStorage;
} // namespace detail
class ConvertFP8TypeAttr : public ::mlir::Attribute::AttrBase<ConvertFP8TypeAttr, ::mlir::Attribute, detail::ConvertFP8TypeAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.convert_fp8_type";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static ConvertFP8TypeAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::ConvertFP8Type value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"convert_fp8_type"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::ConvertFP8Type getValue() const;
};
namespace detail {
struct MMAB1OpAttrStorage;
} // namespace detail
class MMAB1OpAttr : public ::mlir::Attribute::AttrBase<MMAB1OpAttr, ::mlir::Attribute, detail::MMAB1OpAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.mma_b1op";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static MMAB1OpAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::MMAB1Op value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"mma_b1op"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::MMAB1Op getValue() const;
};
namespace detail {
struct MMAIntOverflowAttrStorage;
} // namespace detail
class MMAIntOverflowAttr : public ::mlir::Attribute::AttrBase<MMAIntOverflowAttr, ::mlir::Attribute, detail::MMAIntOverflowAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.mma_int_overflow";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static MMAIntOverflowAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::MMAIntOverflow value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"mma_int_overflow"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::MMAIntOverflow getValue() const;
};
namespace detail {
struct MMAShapeAttrStorage;
} // namespace detail
class MMAShapeAttr : public ::mlir::Attribute::AttrBase<MMAShapeAttr, ::mlir::Attribute, detail::MMAShapeAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.shape";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static MMAShapeAttr get(::mlir::MLIRContext *context, int m, int n, int k);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"shape"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  int getM() const;
  int getN() const;
  int getK() const;
};
namespace detail {
struct MMALayoutAttrStorage;
} // namespace detail
class MMALayoutAttr : public ::mlir::Attribute::AttrBase<MMALayoutAttr, ::mlir::Attribute, detail::MMALayoutAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.mma_layout";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static MMALayoutAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::MMALayout value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"mma_layout"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::MMALayout getValue() const;
};
namespace detail {
struct MMATypesAttrStorage;
} // namespace detail
class MMATypesAttr : public ::mlir::Attribute::AttrBase<MMATypesAttr, ::mlir::Attribute, detail::MMATypesAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.mma_type";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static MMATypesAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::MMATypes value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"mma_type"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::MMATypes getValue() const;
};
namespace detail {
struct MMAFragAttrStorage;
} // namespace detail
class MMAFragAttr : public ::mlir::Attribute::AttrBase<MMAFragAttr, ::mlir::Attribute, detail::MMAFragAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.mma_frag";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static MMAFragAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::MMAFrag value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"mma_frag"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::MMAFrag getValue() const;
};
namespace detail {
struct PrefetchCacheLevelAttrStorage;
} // namespace detail
class PrefetchCacheLevelAttr : public ::mlir::Attribute::AttrBase<PrefetchCacheLevelAttr, ::mlir::Attribute, detail::PrefetchCacheLevelAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.prefetch_cache_level";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static PrefetchCacheLevelAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::PrefetchCacheLevel value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"prefetch_cache_level"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::PrefetchCacheLevel getValue() const;
};
namespace detail {
struct TMAStoreModeAttrStorage;
} // namespace detail
class TMAStoreModeAttr : public ::mlir::Attribute::AttrBase<TMAStoreModeAttr, ::mlir::Attribute, detail::TMAStoreModeAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.tma_store_mode";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static TMAStoreModeAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::TMAStoreMode value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"tma_store_mode"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::TMAStoreMode getValue() const;
};
namespace detail {
struct TMAReduxKindAttrStorage;
} // namespace detail
class TMAReduxKindAttr : public ::mlir::Attribute::AttrBase<TMAReduxKindAttr, ::mlir::Attribute, detail::TMAReduxKindAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.tma_redux_kind";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static TMAReduxKindAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::TMAReduxKind value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"tma_redux_kind"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::TMAReduxKind getValue() const;
};
namespace detail {
struct WGMMAScaleInAttrStorage;
} // namespace detail
class WGMMAScaleInAttr : public ::mlir::Attribute::AttrBase<WGMMAScaleInAttr, ::mlir::Attribute, detail::WGMMAScaleInAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.wgmma_scale_in";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static WGMMAScaleInAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::WGMMAScaleIn value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"wgmma_scale_in"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::WGMMAScaleIn getValue() const;
};
namespace detail {
struct WGMMAScaleOutAttrStorage;
} // namespace detail
class WGMMAScaleOutAttr : public ::mlir::Attribute::AttrBase<WGMMAScaleOutAttr, ::mlir::Attribute, detail::WGMMAScaleOutAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.wgmma_scale_out";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static WGMMAScaleOutAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::WGMMAScaleOut value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"wgmma_scale_out"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::WGMMAScaleOut getValue() const;
};
namespace detail {
struct WGMMATypesAttrStorage;
} // namespace detail
class WGMMATypesAttr : public ::mlir::Attribute::AttrBase<WGMMATypesAttr, ::mlir::Attribute, detail::WGMMATypesAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.wgmma_type";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static WGMMATypesAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::WGMMATypes value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"wgmma_type"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::WGMMATypes getValue() const;
};
namespace detail {
struct MatchSyncKindAttrStorage;
} // namespace detail
class MatchSyncKindAttr : public ::mlir::Attribute::AttrBase<MatchSyncKindAttr, ::mlir::Attribute, detail::MatchSyncKindAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.match_sync_kind";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static MatchSyncKindAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::MatchSyncKind value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"match_sync_kind"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::MatchSyncKind getValue() const;
};
namespace detail {
struct Tcgen05GroupKindAttrStorage;
} // namespace detail
class Tcgen05GroupKindAttr : public ::mlir::Attribute::AttrBase<Tcgen05GroupKindAttr, ::mlir::Attribute, detail::Tcgen05GroupKindAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.tcgen05_group";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static Tcgen05GroupKindAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::Tcgen05GroupKind value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"tcgen05_group"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::Tcgen05GroupKind getValue() const;
};
namespace detail {
struct Tcgen05FenceKindAttrStorage;
} // namespace detail
class Tcgen05FenceKindAttr : public ::mlir::Attribute::AttrBase<Tcgen05FenceKindAttr, ::mlir::Attribute, detail::Tcgen05FenceKindAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.tcgen05_fence";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static Tcgen05FenceKindAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::Tcgen05FenceKind value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"tcgen05_fence"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::Tcgen05FenceKind getValue() const;
};
namespace detail {
struct Tcgen05WaitKindAttrStorage;
} // namespace detail
class Tcgen05WaitKindAttr : public ::mlir::Attribute::AttrBase<Tcgen05WaitKindAttr, ::mlir::Attribute, detail::Tcgen05WaitKindAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.tcgen05_wait";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static Tcgen05WaitKindAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::Tcgen05WaitKind value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"tcgen05_wait"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::Tcgen05WaitKind getValue() const;
};
namespace detail {
struct Tcgen05CpShapeAttrStorage;
} // namespace detail
class Tcgen05CpShapeAttr : public ::mlir::Attribute::AttrBase<Tcgen05CpShapeAttr, ::mlir::Attribute, detail::Tcgen05CpShapeAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.tcgen05_cp_shape";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static Tcgen05CpShapeAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::Tcgen05CpShape value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"tcgen05_cp_shape"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::Tcgen05CpShape getValue() const;
};
namespace detail {
struct Tcgen05CpMulticastAttrStorage;
} // namespace detail
class Tcgen05CpMulticastAttr : public ::mlir::Attribute::AttrBase<Tcgen05CpMulticastAttr, ::mlir::Attribute, detail::Tcgen05CpMulticastAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.tcgen05_cp_multicast";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static Tcgen05CpMulticastAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::Tcgen05CpMulticast value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"tcgen05_cp_multicast"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::Tcgen05CpMulticast getValue() const;
};
namespace detail {
struct Tcgen05CpSrcFormatAttrStorage;
} // namespace detail
class Tcgen05CpSrcFormatAttr : public ::mlir::Attribute::AttrBase<Tcgen05CpSrcFormatAttr, ::mlir::Attribute, detail::Tcgen05CpSrcFormatAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.tcgen05_cp_src_fmt";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static Tcgen05CpSrcFormatAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::Tcgen05CpSrcFormat value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"tcgen05_cp_src_fmt"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::Tcgen05CpSrcFormat getValue() const;
};
namespace detail {
struct Tcgen05LdStShapeAttrStorage;
} // namespace detail
class Tcgen05LdStShapeAttr : public ::mlir::Attribute::AttrBase<Tcgen05LdStShapeAttr, ::mlir::Attribute, detail::Tcgen05LdStShapeAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.tcgen05_ldst_shape";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static Tcgen05LdStShapeAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::Tcgen05LdStShape value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"tcgen05_ldst_shape"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::Tcgen05LdStShape getValue() const;
};
namespace detail {
struct DotAccumulateTypeAttrStorage;
} // namespace detail
class DotAccumulateTypeAttr : public ::mlir::Attribute::AttrBase<DotAccumulateTypeAttr, ::mlir::Attribute, detail::DotAccumulateTypeAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "nvvm.dot_accumulate_type";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  static DotAccumulateTypeAttr get(::mlir::MLIRContext *context, ::mlir::NVVM::DotAccumulateType value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"dot_accumulate_type"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::NVVM::DotAccumulateType getValue() const;
};
namespace detail {
struct NVVMTargetAttrStorage;
} // namespace detail
class NVVMTargetAttr : public ::mlir::Attribute::AttrBase<NVVMTargetAttr, ::mlir::Attribute, detail::NVVMTargetAttrStorage, ::mlir::gpu::TargetAttrVerifyInterface::Trait> {
public:
  using Base::Base;
  bool hasFlag(StringRef flag) const;
  bool hasFastMath() const;
  bool hasFtz() const;
  bool hasCmdOptions() const;
  std::optional<mlir::NamedAttribute> getCmdOptions() const;
  LogicalResult verifyTarget(Operation *gpuModule);
  static constexpr ::llvm::StringLiteral name = "nvvm.target";
  static constexpr ::llvm::StringLiteral dialectName = "nvvm";
  using Base::getChecked;
  static NVVMTargetAttr get(::mlir::MLIRContext *context, int optLevel = 2, StringRef triple = "nvptx64-nvidia-cuda", StringRef chip = "sm_50", StringRef features = "+ptx60", DictionaryAttr targetFlags = nullptr, ArrayAttr linkFiles = nullptr, bool verifyTarget = true);
  static NVVMTargetAttr getChecked(::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError, ::mlir::MLIRContext *context, int optLevel = 2, StringRef triple = "nvptx64-nvidia-cuda", StringRef chip = "sm_50", StringRef features = "+ptx60", DictionaryAttr targetFlags = nullptr, ArrayAttr linkFiles = nullptr, bool verifyTarget = true);
  static ::llvm::LogicalResult verify(::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError, int O, ::llvm::StringRef triple, ::llvm::StringRef chip, ::llvm::StringRef features, DictionaryAttr flags, ArrayAttr link, bool verifyTarget);
  static ::llvm::LogicalResult verifyInvariants(::llvm::function_ref<::mlir::InFlightDiagnostic()> emitError, int O, ::llvm::StringRef triple, ::llvm::StringRef chip, ::llvm::StringRef features, DictionaryAttr flags, ArrayAttr link, bool verifyTarget);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"target"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  int getO() const;
  ::llvm::StringRef getTriple() const;
  ::llvm::StringRef getChip() const;
  ::llvm::StringRef getFeatures() const;
  DictionaryAttr getFlags() const;
  ArrayAttr getLink() const;
  bool getVerifyTarget() const;
  ::mlir::LogicalResult verifyTarget(::mlir::Operation *module) const;
};
} // namespace NVVM
} // namespace mlir
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::CacheEvictionPriorityAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::ReduxKindAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::SharedSpaceAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::ProxyKindAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::MemScopeKindAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::SetMaxRegisterActionAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::ShflKindAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::VoteSyncKindAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::LoadCacheModifierKindAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::FPRoundingModeAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::SaturationModeAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::ConvertFP6TypeAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::ConvertFP8TypeAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::MMAB1OpAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::MMAIntOverflowAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::MMAShapeAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::MMALayoutAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::MMATypesAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::MMAFragAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::PrefetchCacheLevelAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::TMAStoreModeAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::TMAReduxKindAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::WGMMAScaleInAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::WGMMAScaleOutAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::WGMMATypesAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::MatchSyncKindAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::Tcgen05GroupKindAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::Tcgen05FenceKindAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::Tcgen05WaitKindAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::Tcgen05CpShapeAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::Tcgen05CpMulticastAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::Tcgen05CpSrcFormatAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::Tcgen05LdStShapeAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::DotAccumulateTypeAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::NVVM::NVVMTargetAttr)

#endif  // GET_ATTRDEF_CLASSES

