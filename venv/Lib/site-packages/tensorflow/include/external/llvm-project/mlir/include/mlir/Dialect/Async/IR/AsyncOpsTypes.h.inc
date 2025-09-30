/*===- TableGen'erated file -------------------------------------*- C++ -*-===*\
|*                                                                            *|
|* TypeDef Declarations                                                       *|
|*                                                                            *|
|* Automatically generated file, do not edit!                                 *|
|*                                                                            *|
\*===----------------------------------------------------------------------===*/

#ifdef GET_TYPEDEF_CLASSES
#undef GET_TYPEDEF_CLASSES


namespace mlir {
class AsmParser;
class AsmPrinter;
} // namespace mlir
namespace mlir {
namespace async {
/// async token type
/// `async.token` is a type returned by asynchronous operations, and it becomes
///     `available` when the asynchronous operations that created it is completed.
class TokenType;
/// async value type
/// `async.value` represents a value returned by asynchronous operations,
///     which may or may not be available currently, but will be available at some
///     point in the future.
class ValueType;
/// async group type
/// `async.group` represent a set of async tokens or values and allows to
///     execute async operations on all of them together (e.g. wait for the
///     completion of all/any of them).
class GroupType;
/// switched-resume coroutine identifier
/// `async.coro.id` is a type identifying a switched-resume coroutine.
class CoroIdType;
/// coroutine handle
/// `async.coro.handle` is a handle to the coroutine (pointer to the coroutine
///     frame) that can be passed around to resume or destroy the coroutine.
class CoroHandleType;
/// saved coroutine state
/// `async.coro.state` is a saved coroutine state that should be passed to the
///     coroutine suspension operation.
class CoroStateType;
class TokenType : public ::mlir::Type::TypeBase<TokenType, ::mlir::Type, ::mlir::TypeStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "async.token";
  static constexpr ::llvm::StringLiteral dialectName = "async";
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"token"};
  }

};
namespace detail {
struct ValueTypeStorage;
} // namespace detail
class ValueType : public ::mlir::Type::TypeBase<ValueType, ::mlir::Type, detail::ValueTypeStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "async.value";
  static constexpr ::llvm::StringLiteral dialectName = "async";
  static ValueType get(Type valueType);
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"value"};
  }

  static ::mlir::Type parse(::mlir::AsmParser &odsParser);
  void print(::mlir::AsmPrinter &odsPrinter) const;
  Type getValueType() const;
};
class GroupType : public ::mlir::Type::TypeBase<GroupType, ::mlir::Type, ::mlir::TypeStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "async.group";
  static constexpr ::llvm::StringLiteral dialectName = "async";
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"group"};
  }

};
class CoroIdType : public ::mlir::Type::TypeBase<CoroIdType, ::mlir::Type, ::mlir::TypeStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "async.coro.id";
  static constexpr ::llvm::StringLiteral dialectName = "async";
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"coro.id"};
  }

};
class CoroHandleType : public ::mlir::Type::TypeBase<CoroHandleType, ::mlir::Type, ::mlir::TypeStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "async.coro.handle";
  static constexpr ::llvm::StringLiteral dialectName = "async";
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"coro.handle"};
  }

};
class CoroStateType : public ::mlir::Type::TypeBase<CoroStateType, ::mlir::Type, ::mlir::TypeStorage> {
public:
  using Base::Base;
  static constexpr ::llvm::StringLiteral name = "async.coro.state";
  static constexpr ::llvm::StringLiteral dialectName = "async";
  static constexpr ::llvm::StringLiteral getMnemonic() {
    return {"coro.state"};
  }

};
} // namespace async
} // namespace mlir
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::async::TokenType)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::async::ValueType)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::async::GroupType)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::async::CoroIdType)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::async::CoroHandleType)
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::async::CoroStateType)

#endif  // GET_TYPEDEF_CLASSES

