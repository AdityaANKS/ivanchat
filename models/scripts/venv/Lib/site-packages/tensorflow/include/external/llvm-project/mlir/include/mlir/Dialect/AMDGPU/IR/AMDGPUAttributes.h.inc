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
namespace amdgpu {
/// AMDGPU-specific address spaces
/// AMDGPU-specific memory spaces that may not have exact analogues on other
///     GPU targets or backends.
/// 
///     - `fat_raw_buffer` is the memory space used when a memref is stored as
///     as a "buffer fat pointer" - that is, a buffer resource (that is set up to
///     use raw byte-level indexing) along with its offset. The AMDGPU backend
///     implements `ptr addrspace(7)` to represent these fat pointers so that
///     buffer resources (which allow advanced features like bounds checking or
///     cache swizzling) can be used like ordinary LLVM pointers or memrefs.
///     See also the `fat_raw_buffer_cast` operation
///     - `buffer_rsrc` is the memory space for `ptr addrspace(8)`, representing a
///     buffer resource. It should not be used for memrefs, since it does not support
///     indexing
///     - `fat_structured_buffer` represents `ptr addrspace(9)`, a buffer resource
///     that carries both an index and offset field, which are used for complex
///     structured indexing that is primarily seen in graphics applications. This
///     is also incompatible with the simple indexing model supported by memref.
class AddressSpaceAttr;
/// The possible permutations for a DPP operation
class DPPPermAttr;
/// The possible options for scheduling barriers
class sched_barrier_opt_enumAttr;
/// The possible permutations of the lanes storing B available in an MFMA
class MFMAPermBAttr;
namespace detail {
struct AddressSpaceAttrStorage;
} // namespace detail
class AddressSpaceAttr : public ::mlir::Attribute::AttrBase<AddressSpaceAttr, ::mlir::Attribute, detail::AddressSpaceAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "amdgpu.address_space";
  static constexpr ::llvm::StringLiteral dialectName = "amdgpu";
  static AddressSpaceAttr get(::mlir::MLIRContext *context, ::mlir::amdgpu::AddressSpace value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"address_space"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::amdgpu::AddressSpace getValue() const;
};
namespace detail {
struct DPPPermAttrStorage;
} // namespace detail
class DPPPermAttr : public ::mlir::Attribute::AttrBase<DPPPermAttr, ::mlir::Attribute, detail::DPPPermAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "amdgpu.dpp_perm";
  static constexpr ::llvm::StringLiteral dialectName = "amdgpu";
  static DPPPermAttr get(::mlir::MLIRContext *context, ::mlir::amdgpu::DPPPerm value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"dpp_perm"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::amdgpu::DPPPerm getValue() const;
};
namespace detail {
struct sched_barrier_opt_enumAttrStorage;
} // namespace detail
class sched_barrier_opt_enumAttr : public ::mlir::Attribute::AttrBase<sched_barrier_opt_enumAttr, ::mlir::Attribute, detail::sched_barrier_opt_enumAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "amdgpu.sched_barrier_opt";
  static constexpr ::llvm::StringLiteral dialectName = "amdgpu";
  static sched_barrier_opt_enumAttr get(::mlir::MLIRContext *context, ::mlir::amdgpu::sched_barrier_opt_enum value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"sched_barrier_opt"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::amdgpu::sched_barrier_opt_enum getValue() const;
};
namespace detail {
struct MFMAPermBAttrStorage;
} // namespace detail
class MFMAPermBAttr : public ::mlir::Attribute::AttrBase<MFMAPermBAttr, ::mlir::Attribute, detail::MFMAPermBAttrStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "amdgpu.mfma_perm_b";
  static constexpr ::llvm::StringLiteral dialectName = "amdgpu";
  static MFMAPermBAttr get(::mlir::MLIRContext *context, ::mlir::amdgpu::MFMAPermB value);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"mfma_perm_b"};
  }

  static ::mlir::Attribute parse(::mlir::AsmParser &odsParser, ::mlir::Type odsType);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  ::mlir::amdgpu::MFMAPermB getValue() const;
};
} // namespace amdgpu
} // namespace mlir
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::amdgpu::AddressSpaceAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::amdgpu::DPPPermAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::amdgpu::sched_barrier_opt_enumAttr)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::amdgpu::MFMAPermBAttr)

#endif  // GET_ATTRDEF_CLASSES

