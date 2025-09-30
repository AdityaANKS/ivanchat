/*===- TableGen'erated file -------------------------------------*- C++ -*-===*\
|*                                                                            *|
|* Dialect Declarations                                                       *|
|*                                                                            *|
|* Automatically generated file, do not edit!                                 *|
|* From: SPIRVOps.td                                                          *|
|*                                                                            *|
\*===----------------------------------------------------------------------===*/

namespace mlir {
namespace spirv {

/// The SPIR-V dialect in MLIR.
/// SPIR-V is a binary intermediate language for representing graphical-shader
///     stages and compute kernels for multiple Khronos APIs, including OpenCL,
///     OpenGL, and Vulkan.
///     See https://www.khronos.org/registry/spir-v for more details regarding
///     SPIR-V itself.
/// 
///     The SPIR-V dialect aims to be a proper compiler intermediate representation
///     to facilitate transformations. Ops in this dialect stay at the same semantic
///     level as the SPIR-V specification and try to have one-to-one mapping to the
///     corresponding SPIR-V instructions; but they may deviate representationally
///     to utilize MLIR mechanisms if it results in better representation and thus
///     benefits transformations. The dialect also aims to maintain straightforward
///     serialization into and deserialization from the SPIR-V binary format.
///     See https://mlir.llvm.org/docs/Dialects/SPIR-V/ for more details regarding
///     high-level designs and implementation structures of the SPIR-V dialect.
class SPIRVDialect : public ::mlir::Dialect {
  explicit SPIRVDialect(::mlir::MLIRContext *context);

  void initialize();
  friend class ::mlir::MLIRContext;
public:
  ~SPIRVDialect() override;
  static constexpr ::llvm::StringLiteral getDialectNamespace() {
    return ::llvm::StringLiteral("spirv");
  }

  /// Parse a type registered to this dialect.
  ::mlir::Type parseType(::mlir::DialectAsmParser &parser) const override;

  /// Print a type registered to this dialect.
  void printType(::mlir::Type type,
                 ::mlir::DialectAsmPrinter &os) const override;

  /// Materialize a single constant operation from a given attribute value with
  /// the desired resultant type.
  ::mlir::Operation *materializeConstant(::mlir::OpBuilder &builder,
                                         ::mlir::Attribute value,
                                         ::mlir::Type type,
                                         ::mlir::Location loc) override;

    /// Provides a hook for verifying dialect attributes attached to the given
    /// op.
    ::llvm::LogicalResult verifyOperationAttribute(
        ::mlir::Operation *op, ::mlir::NamedAttribute attribute) override;

    /// Provides a hook for verifying dialect attributes attached to the given
    /// op's region argument.
    ::llvm::LogicalResult verifyRegionArgAttribute(
        ::mlir::Operation *op, unsigned regionIndex, unsigned argIndex,
        ::mlir::NamedAttribute attribute) override;

    /// Provides a hook for verifying dialect attributes attached to the given
    /// op's region result.
    ::llvm::LogicalResult verifyRegionResultAttribute(
        ::mlir::Operation *op, unsigned regionIndex, unsigned resultIndex,
        ::mlir::NamedAttribute attribute) override;

    void registerAttributes();
    void registerTypes();

    //===------------------------------------------------------------------===//
    // Attribute
    //===------------------------------------------------------------------===//

    /// Returns the attribute name to use when specifying decorations on results
    /// of operations.
    static std::string getAttributeName(Decoration decoration);

    /// Dialect attribute parsing hook.
    Attribute parseAttribute(
        DialectAsmParser &parser, Type type) const override;
    /// Dialect attribute printing hook.
    void printAttribute(
        Attribute attr, DialectAsmPrinter &printer) const override;
  };
} // namespace spirv
} // namespace mlir
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::spirv::SPIRVDialect)
