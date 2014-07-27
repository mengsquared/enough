//
//  ViewController.m
//  Enough
//
//  Created by Raymond Jacobson on 7/26/14.
//  Copyright (c) 2014 raymondjacobson. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()

@property (nonatomic, strong) NSMutableArray *arrContactsData;
@property (nonatomic, strong) NSMutableArray *addedNumbers;
@property (nonatomic, strong) ABPeoplePickerNavigationController *addressBookController;

-(void)showAddressBook;
-(void)populateNumbers;
-(void)postRequest:(NSString *)url data:(NSMutableDictionary *)data;
-(NSDictionary *)getRequest:(NSString *)url;

@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
    UITapGestureRecognizer *singleTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleSingleTap:)];
    [self.view addGestureRecognizer:singleTap];
    NSString *savedValue = [[NSUserDefaults standardUserDefaults]
                            stringForKey:@"ENOUGH_PHONE_NUMBER"];
    [self populateNumbers:savedValue];
    UIColor *color = [UIColor colorWithRed:(200/255.0) green:(200/255.0) blue:(200/255.0) alpha:1];
    NSString * placeholderText = @"Your Phone Number";
    _ownPhoneField.attributedPlaceholder = [[NSAttributedString alloc] initWithString:placeholderText attributes:@{NSForegroundColorAttributeName: color}];
    placeholderText = @"Post Key";
    _sendPostField.attributedPlaceholder = [[NSAttributedString alloc] initWithString:placeholderText attributes:@{NSForegroundColorAttributeName: color}];
    if ([savedValue length] != 0) _ownPhoneField.text = savedValue;
}
-(void)handleSingleTap:(UITapGestureRecognizer *)sender{
    [_ownPhoneField resignFirstResponder];
    [_sendPostField resignFirstResponder];
    puts("Dismissed the keyboard");
}
- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)addContact:(id)sender {
    [self showAddressBook];
//    [self postRequest:@"http://localhost:2468/testpost" data:contactInfoDict];
}

- (IBAction)setNumber:(id)sender {
    NSString* phoneNumber = _ownPhoneField.text;
    NSMutableDictionary *dataDict = [[NSMutableDictionary alloc]
                                            initWithObjects:@[@""]
                                            forKeys:@[@"phoneNumber"]];
    [dataDict setObject:phoneNumber forKey:@"phoneNumber"];
    [self postRequest:@"http://localhost:2468/add_phone" data:dataDict];
    [[NSUserDefaults standardUserDefaults] setObject:phoneNumber forKey:@"ENOUGH_PHONE_NUMBER"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}


- (IBAction)sendPost:(id)sender {
}

- (void)postRequest:(NSString *)url data:(NSMutableDictionary *)inputData {
    NSError*error;
    //convert object to data
    NSData* jsonData = [NSJSONSerialization dataWithJSONObject:inputData options:kNilOptions error:&error];
    
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    [request setURL:[NSURL URLWithString:url]];
    [request setHTTPMethod:@"POST"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];
    [request setValue:[NSString stringWithFormat:@"%d", [jsonData length]] forHTTPHeaderField:@"Content-Length"];
    
    [request setHTTPBody:jsonData];
    [[NSURLConnection alloc] initWithRequest:request delegate:self];
    NSLog(@"Post request for");
    NSLog([inputData objectForKey:@"firstName"]);
    NSString *savedValue = [[NSUserDefaults standardUserDefaults]
                            stringForKey:@"ENOUGH_PHONE_NUMBER"];
    [self populateNumbers:savedValue];
    [tableView reloadData];
}

-(NSDictionary *)getRequest:(NSString *)url {
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    [request setURL:[NSURL URLWithString:url]];
    [request setHTTPMethod:@"GET"];
    [request setValue:@"application/json;charset=UTF-8" forHTTPHeaderField:@"Content-Type"];
    
    NSURLResponse *response;
    NSData *GETReply = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:nil];
    NSString *theReply = [[NSString alloc] initWithBytes:[GETReply bytes] length:[GETReply length] encoding: NSASCIIStringEncoding];
    NSLog(@"Reply: %@", theReply);

    NSError* error;
    NSDictionary* json = [NSJSONSerialization
                          JSONObjectWithData:GETReply
                          
                          options:kNilOptions
                          error:&error];
    return json;
}
//
-(void)populateNumbers:(NSString *)savedNumber {
    NSString * key = savedNumber;
    NSDictionary * results = [self getRequest:@"https://enough-ios-test.firebaseio.com/users.json"];
    NSDictionary * results_iter = [results objectForKey:key];
    addedNumbers = [[NSMutableArray alloc]init];
    for(NSString *key in [results_iter allKeys]) {
        NSLog([[results_iter objectForKey:key] objectForKey:@"member"]);
        [addedNumbers addObject:[[results_iter objectForKey:key] objectForKey:@"member"]];
    }
//    NSLog([addedNumbers description]);
    [tableView reloadData];
}

// Table

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
	// Return the number of time zone names.
	return [addedNumbers count];
}


- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    static NSString *CellIdentifier = @"thisCell";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier forIndexPath:indexPath];
    cell.textLabel.text = [addedNumbers objectAtIndex:indexPath.row];
    
	return cell;
}


#pragma mark - Address Book

-(void)showAddressBook{
    _addressBookController = [[ABPeoplePickerNavigationController alloc] init];
    [_addressBookController setPeoplePickerDelegate:self];
    [self presentViewController:_addressBookController animated:YES completion:nil];
}

-(void)peoplePickerNavigationControllerDidCancel:(ABPeoplePickerNavigationController *)peoplePicker{
    [_addressBookController dismissViewControllerAnimated:YES completion:nil];
}
-(BOOL)peoplePickerNavigationController:(ABPeoplePickerNavigationController *)peoplePicker shouldContinueAfterSelectingPerson:(ABRecordRef)person{
    // Initialize a mutable dictionary and give it initial values.
    NSMutableDictionary *contactInfoDict = [[NSMutableDictionary alloc]
                                            initWithObjects:@[@"", @"", @"", @""]
                                            forKeys:@[@"firstName", @"lastName", @"mobileNumber", @"homeEmail"]];
    
    // Use a general Core Foundation object.
    CFTypeRef generalCFObject = ABRecordCopyValue(person, kABPersonFirstNameProperty);
    
    // Get the first name.
    if (generalCFObject) {
        [contactInfoDict setObject:(__bridge NSString *)generalCFObject forKey:@"firstName"];
        CFRelease(generalCFObject);
    }
    
    // Get the last name.
    generalCFObject = ABRecordCopyValue(person, kABPersonLastNameProperty);
    if (generalCFObject) {
        [contactInfoDict setObject:(__bridge NSString *)generalCFObject forKey:@"lastName"];
        CFRelease(generalCFObject);
    }
    
    // Get the phone numbers as a multi-value property.
    ABMultiValueRef phonesRef = ABRecordCopyValue(person, kABPersonPhoneProperty);
    for (int i=0; i<ABMultiValueGetCount(phonesRef); i++) {
        CFStringRef currentPhoneLabel = ABMultiValueCopyLabelAtIndex(phonesRef, i);
        CFStringRef currentPhoneValue = ABMultiValueCopyValueAtIndex(phonesRef, i);
        
        if (CFStringCompare(currentPhoneLabel, kABPersonPhoneMobileLabel, 0) == kCFCompareEqualTo) {
            [contactInfoDict setObject:(__bridge NSString *)currentPhoneValue forKey:@"mobileNumber"];
        }
        
        if (CFStringCompare(currentPhoneLabel, kABHomeLabel, 0) == kCFCompareEqualTo) {
            [contactInfoDict setObject:(__bridge NSString *)currentPhoneValue forKey:@"homeNumber"];
        }
        
        CFRelease(currentPhoneLabel);
        CFRelease(currentPhoneValue);
    }
    CFRelease(phonesRef);
    
    
    // Get the e-mail addresses as a multi-value property.
    ABMultiValueRef emailsRef = ABRecordCopyValue(person, kABPersonEmailProperty);
    for (int i=0; i<ABMultiValueGetCount(emailsRef); i++) {
        CFStringRef currentEmailLabel = ABMultiValueCopyLabelAtIndex(emailsRef, i);
        CFStringRef currentEmailValue = ABMultiValueCopyValueAtIndex(emailsRef, i);
        
        if (CFStringCompare(currentEmailLabel, kABHomeLabel, 0) == kCFCompareEqualTo) {
            [contactInfoDict setObject:(__bridge NSString *)currentEmailValue forKey:@"homeEmail"];
        }
        
        if (CFStringCompare(currentEmailLabel, kABWorkLabel, 0) == kCFCompareEqualTo) {
            [contactInfoDict setObject:(__bridge NSString *)currentEmailValue forKey:@"workEmail"];
        }
        
        CFRelease(currentEmailLabel);
        CFRelease(currentEmailValue);
    }
    CFRelease(emailsRef);
    // Initialize the array if it's not yet initialized.
    if (_arrContactsData == nil) {
        _arrContactsData = [[NSMutableArray alloc] init];
    }
    // Add the dictionary to the array.
    [_arrContactsData addObject:contactInfoDict];
    NSString *pilotPhoneNumber = [[NSUserDefaults standardUserDefaults]
                            stringForKey:@"ENOUGH_PHONE_NUMBER"];
    [contactInfoDict setObject:pilotPhoneNumber forKey:@"pilotPhoneNumber"];
    NSLog([contactInfoDict description]);
    [self postRequest:@"http://localhost:2468/insert" data:contactInfoDict];
    [_addressBookController dismissViewControllerAnimated:YES completion:nil];

    return NO;
}
-(BOOL)peoplePickerNavigationController:(ABPeoplePickerNavigationController *)peoplePicker shouldContinueAfterSelectingPerson:(ABRecordRef)person property:(ABPropertyID)property identifier:(ABMultiValueIdentifier)identifier{
    return NO;
}

@end
