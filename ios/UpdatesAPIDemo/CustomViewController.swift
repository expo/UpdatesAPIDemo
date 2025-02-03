import UIKit

public class CustomViewController: UIViewController {
  let appDelegate = AppDelegate.shared()

  public convenience init() {
    self.init(nibName: nil, bundle: nil)
  }

  required public override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
    super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
  }

  required public init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
}
