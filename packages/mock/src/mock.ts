/**
 * The basic interface for implementing the Mock Object Pattern. Use this to
 * virtualize real world interactions, like database calls or the file system.
 */
export interface Mock {
  /**
   * Activate the Mock, so subsequent code runs against a fake implementation. Should only be used if patching imports/requires is unavoidable. Use the mock or a sandbox directly with dependency injection if possible.
   * Beware not to call activate on multiple mocks of the same type.
   */
  activate: () => any

  /**
   * Deactivate the Mock, so subsequent code runs as usual
   */
  deactivate: () => any

  /**
   * A Mock should be able to resets its internal state to its starting point without deactivating the mock
   */
  reset: () => any
}
