/*===- TableGen'erated file -------------------------------------*- C++ -*-===*\
|*                                                                            *|
|* Dialect Declarations                                                       *|
|*                                                                            *|
|* Automatically generated file, do not edit!                                 *|
|* From: VCIXOps.td                                                           *|
|*                                                                            *|
\*===----------------------------------------------------------------------===*/

namespace mlir {
namespace vcix {

/// The SiFive Vector Coprocessor Interface (VCIX) provides a flexible mechanism
///      to extend application processors with custom coprocessors and
///      variable-latency arithmetic units. The interface offers throughput comparable
///      to that of standard RISC-V vector instructions. To accelerate performance,
///      system designers may use VCIX as a low-latency, high-throughput interface to
///      a coprocessor
/// 
///      https://www.sifive.com/document-file/sifive-vector-coprocessor-interface-vcix-software
class VCIXDialect : public ::mlir::Dialect {
  explicit VCIXDialect(::mlir::MLIRContext *context);

  void initialize();
  friend class ::mlir::MLIRContext;
public:
  ~VCIXDialect() override;
  static constexpr ::llvm::StringLiteral getDialectNamespace() {
    return ::llvm::StringLiteral("vcix");
  }
};
} // namespace vcix
} // namespace mlir
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::vcix::VCIXDialect)
